import {
  appendInitialChild,
  createInstance,
  createTextInstance,
  Instance,
} from "hostConfig";
import { FiberNode } from "./fiber";
import { HostComponent, HostRoot, HostText } from "./workTags";
import { NoFlags } from "./fiberFlags";

export const appendAllChildren = (parent: Instance, wip: FiberNode) => {
  let node = wip.child;
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === wip) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === wip) {
        return;
      }
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
};

export const completeWork = (wip: FiberNode): FiberNode => {
  const newProps = wip.pendingProps;
  const current = wip.alternate;

  switch (wip.tag) {
    case HostComponent: {
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // mount
        // 1. 构建DOM
        const instance = createInstance(wip.type, newProps);
        // 2. 插入DOM
        appendAllChildren(instance, wip);
        // 3. 更新stateNode
        wip.stateNode = instance;
      }
      bubbleUpProperties(wip);
      break;
    }
    case HostText:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // mount
        // 1. 构建DOM
        const instance = createTextInstance(wip.pendingProps.content);
        // 3. 更新stateNode
        wip.stateNode = instance;
      }
      bubbleUpProperties(wip);
      break;
    case HostRoot:
      bubbleUpProperties(wip);
      break;
    default:
      break;
  }
  return wip;
};

// 后续更新，就不需要全部遍历来找到要改变的flag
export const bubbleUpProperties = (wip: FiberNode) => {
  let subtreeFlags = NoFlags;
  let child = wip.child;
  while (child !== null) {
    subtreeFlags |= child.flags;
    subtreeFlags |= child.subtreeFlags;

    child.return = wip;
    child = child.sibling;
  }
  wip.subtreeFlags |= subtreeFlags;
};
