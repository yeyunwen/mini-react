import {
  isNumber,
  isObject,
  isString,
  REACT_ELEMENT_TYPE,
  ReactElementType,
} from "shared";
import { createFiberFormElement, FiberNode } from "./fiber";
import { HostText } from "./workTags";
import { Placement } from "./fiberFlags";

export const childReconciler = (shouldTrackEffects: boolean) => {
  const reconcileSignalElement = (
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElementType,
  ) => {
    const fiber = createFiberFormElement(element);
    fiber.return = returnFiber;
    return fiber;
  };

  const reconcileSingleTextNode = (
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number,
  ) => {
    const fiber = new FiberNode(HostText, { content }, null);
    fiber.return = returnFiber;
    return fiber;
  };

  const placeSingleChild = (fiber: FiberNode): FiberNode => {
    // 此时fiber为wip，wip.alternate === current === null 说明为mount
    if (shouldTrackEffects && fiber.alternate === null) {
      fiber.flags |= Placement;
    }
    return fiber;
  };

  const reconcileChildFiber = (
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild: ReactElementType,
  ) => {
    if (isObject(newChild)) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          return placeSingleChild(
            reconcileSignalElement(returnFiber, currentFiber, newChild),
          );
        }
        default: {
          if (__DEV__) {
            console.warn(`reconcileChildFibers: 未知的子节点类型: ${newChild}`);
          }
          break;
        }
      }
    } else if (isString(newChild) || isNumber(newChild)) {
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFiber, newChild),
      );
    } else {
      if (__DEV__) {
        console.warn(`reconcileChildFibers: 未知的子节点类型: ${newChild}`);
      }
    }
    return null;
  };

  return reconcileChildFiber;
};

export const reconcileChildFibers = childReconciler(true);
export const mountChildFibers = childReconciler(false);
