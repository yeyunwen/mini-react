import { Container } from "hostConfig";
import { FiberNode, FiberRootNode } from "./fiber";
import { HostRoot } from "./workTags";
import {
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
  UpdateQueue,
} from "./updateQueue";
import { ReactElementType } from "shared";
import { scheduleUpdateOnFiber } from "./workLoop";

export const createContainer = (container: Container) => {
  const hostRootRiber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(container, hostRootRiber);
  hostRootRiber.updateQueue = createUpdateQueue();
  return root;
};

export const updateContainer = (
  element: ReactElementType | null,
  root: FiberRootNode,
) => {
  const hostRootRiber = root.current;
  const update = createUpdate<ReactElementType | null>(element);
  enqueueUpdate(hostRootRiber.updateQueue as UpdateQueue<any>, update);
  scheduleUpdateOnFiber(hostRootRiber);
  return element;
};
