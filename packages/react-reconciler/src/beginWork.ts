import { mountChildFibers, reconcileChildFibers } from "./childFiber";
import { FiberNode } from "./fiber";
import { renderWithHooks } from "./fiberHooks";
import { processUpdateQueue, UpdateQueue } from "./updateQueue";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "./workTags";

export const beginWork = (fiber: FiberNode) => {
  switch (fiber.tag) {
    case HostRoot: {
      return updateHostRoot(fiber);
    }
    case HostComponent: {
      return updateHostComponent(fiber);
    }
    case HostText: {
      return null;
    }
    case FunctionComponent: {
      return updateFunctionComponent(fiber);
    }
    default: {
      if (__DEV__) {
        console.warn(`beginWork: 未知 fiber tag: ${fiber.tag}`);
      }
      break;
    }
  }
  return null;
};

export const updateHostRoot = (wip: FiberNode) => {
  const baseState = wip.memoizedState;
  const updateQueue = wip.updateQueue as UpdateQueue<Element>;
  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending);

  const nextChlidren = (wip.memoizedState = memoizedState);
  reconcileChildren(wip, nextChlidren);

  return wip.child;
};

export const updateHostComponent = (wip: FiberNode) => {
  const nextProps = wip.pendingProps;
  const nextChlidren = nextProps.children;
  reconcileChildren(wip, nextChlidren);

  return wip.child;
};

export const updateFunctionComponent = (wip: FiberNode) => {
  const nextChildren = renderWithHooks(wip);
  reconcileChildren(wip, nextChildren);

  return wip.child;
};

export const reconcileChildren = (wip: FiberNode, children: any) => {
  const current = wip.alternate;
  if (current !== null) {
    // update
    wip.child = reconcileChildFibers(wip, current.child, children);
  } else {
    // mount
    wip.child = mountChildFibers(wip, null, children);
  }
};
