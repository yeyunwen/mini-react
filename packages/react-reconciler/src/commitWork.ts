import { appendChildToContainer, Container } from "hostConfig";
import { FiberNode, FiberRootNode } from "./fiber";
import { MutationMask, NoFlags, Placement } from "./fiberFlags";
import { HostComponent, HostRoot, HostText } from "./workTags";

let nextEffects: FiberNode | null = null;

export const getHostParent = (fiber: FiberNode) => {
  let parent = fiber.return;
  while (parent !== null) {
    if (parent.tag === HostComponent) {
      return parent.stateNode as Container;
    }
    if (parent.tag === HostRoot) {
      return (parent.stateNode as FiberRootNode).container;
    }
    parent = parent.return;
  }
  if (__DEV__) {
    console.warn("getHostParent: 未知的 fiber tag", fiber.tag);
  }
};

export const appendPlacementNodeToContainer = (
  finishedWork: FiberNode,
  hostParent: Container,
) => {
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    appendChildToContainer(hostParent, finishedWork.stateNode);
    return;
  }
  const child = finishedWork.child;
  if (child !== null) {
    appendPlacementNodeToContainer(child, hostParent);
    let sibling = child.sibling;
    while (sibling !== null) {
      appendPlacementNodeToContainer(sibling, hostParent);
      sibling = sibling.sibling;
    }
  }
};

export const commitPlacement = (finishedWork: FiberNode) => {
  if (__DEV__) {
    console.warn("执行Placement", finishedWork);
  }
  const hostParent = getHostParent(finishedWork);
  appendPlacementNodeToContainer(finishedWork.stateNode, hostParent);
};

export const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
  const flags = finishedWork.flags;

  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork);
    finishedWork.flags &= ~Placement;
  }
  // Update
  // Clidren
};

export const commitMutationEffects = (finishedWork: FiberNode) => {
  nextEffects = finishedWork;

  while (nextEffects !== null) {
    // 向下遍历
    const child: FiberNode | null = nextEffects.child;
    if (
      (nextEffects.subtreeFlags & MutationMask) !== NoFlags &&
      child !== null
    ) {
      nextEffects = child;
    } else {
      // 向上遍历
      up: while (nextEffects !== null) {
        commitMutationEffectsOnFiber(nextEffects);
        const sibling: FiberNode | null = nextEffects.sibling;
        if (sibling !== null) {
          nextEffects = sibling;
          break up;
        } else {
          nextEffects = nextEffects.return;
        }
      }
    }
  }
};
