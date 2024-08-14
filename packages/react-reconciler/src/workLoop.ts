import { Props } from "shared";
import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";
import { FiberNode, FiberRootNode } from "./fiber";
import { HostRoot } from "./workTags";
import { NoFlags } from "./fiberFlags";

let workInProgress: FiberNode | null = null;

const createWorkInProgress = (
  current: FiberNode,
  pendingProps: Props,
): FiberNode => {
  let wip = current.alternate;
  if (wip === null) {
    // mount
    wip = new FiberNode(current.tag, pendingProps, current.key);
    wip.stateNode = current.stateNode;
    wip.alternate = current;
    current.alternate = wip;
  } else {
    // update
    wip.pendingProps = pendingProps;
    wip.flags = NoFlags;
    wip.subtreeFlags = NoFlags;
  }
  wip.type = current.type;
  wip.updateQueue = current.updateQueue;
  wip.child = current.child;
  wip.memoizedProps = current.memoizedProps;
  wip.memoizedState = current.memoizedState;

  return wip;
};

const prepareFreshStack = (root: FiberRootNode) => {
  workInProgress = createWorkInProgress(root.current, {});
};

export const markUpdateFormFiberToRoot = (fiber: FiberNode) => {
  let node = fiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  if (node.tag === HostRoot) {
    return node.stateNode;
  }
  return null;
};

export const shcheduleUpdateOnFiber = (fiber: FiberNode) => {
  const root = markUpdateFormFiberToRoot(fiber);
  renderRoot(root);
};

const completeUnitOfWork = (fiber: FiberNode) => {
  let node: FiberNode | null = fiber;
  do {
    completeWork(node);
    const sibling = node.sibling;
    if (sibling) {
      workInProgress = sibling;
    } else {
      node = node.return;
      workInProgress = node;
    }
  } while (node !== null);
};

const performUnitOfWork = (fiber: FiberNode) => {
  const next = beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;
  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
};

const workLoop = () => {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
};

const renderRoot = (root: FiberRootNode) => {
  // 初始化
  prepareFreshStack(root);

  // 开始工作
  do {
    try {
      workLoop();
      break;
    } catch (error) {
      if (__DEV__) {
        console.warn(error);
      }
      workInProgress = null;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;

  commitRoot(root);
};
function commitRoot(root: FiberRootNode) {
  throw new Error("Function not implemented.");
}
