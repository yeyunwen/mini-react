import { Dispatcher } from "react";
import { FiberNode } from "./fiber";
import { Action, internals, isFunction } from "shared";
import {
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
  UpdateQueue,
} from "./updateQueue";
import { scheduleUpdateOnFiber } from "./workLoop";

let currentlyRenderingFiber: FiberNode | null = null;
let workInProgreesHooks: Hook | null = null;
const { currentDispatcher } = internals;

export interface Hook {
  memoizedState: any;
  updateQueue: unknown;
  next: Hook | null;
}

export const renderWithHooks = (wip: FiberNode) => {
  // 赋值
  currentlyRenderingFiber = wip;
  wip.memoizedState = null;

  const current = wip.alternate;

  if (current === null) {
    // mount
    currentDispatcher.current = HooksDispatcherOnMount;
  } else {
    // update
  }

  const Component = wip.type;
  const props = wip.pendingProps;
  const children = Component(props);

  // 重置
  currentlyRenderingFiber = null;

  return children;
};

const mountWorkInProgressHook = (): Hook => {
  const hook: Hook = {
    memoizedState: null,
    updateQueue: null,
    next: null,
  };
  if (workInProgreesHooks === null) {
    // mount 时，第一个hook
    if (currentlyRenderingFiber === null) {
      throw new Error(
        "请在函数组件中调用hooks, currentlyRenderingFiber is null",
      );
    } else {
      workInProgreesHooks = hook;
      currentlyRenderingFiber.memoizedState = workInProgreesHooks;
    }
  } else {
    // mount 时，后续hook
    workInProgreesHooks.next = hook;
    workInProgreesHooks = hook;
  }
  return workInProgreesHooks;
};

const dispatchSetState = <State>(
  fiber: FiberNode,
  updateQueue: UpdateQueue<State>,
  aciton: Action<State>,
) => {
  const update = createUpdate<State>(aciton);
  enqueueUpdate(updateQueue, update);
  scheduleUpdateOnFiber(fiber);
};

const mountState: Dispatcher["useState"] = <State>(
  initialState: State | (() => State),
) => {
  const hook = mountWorkInProgressHook();
  const memoizedState = isFunction(initialState)
    ? initialState()
    : initialState;
  const queue = createUpdateQueue<State>();
  hook.updateQueue = queue;

  // @ts-ignore
  const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber!, queue);
  queue.dispatch = dispatch;

  return [memoizedState, dispatch];
};

const HooksDispatcherOnMount: Dispatcher = {
  useState: mountState,
};
