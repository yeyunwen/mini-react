import {
  Props,
  Key,
  Ref,
  ReactElementType,
  isString,
  isFunction,
} from "shared";
import { HostComponent, WorkTag } from "./workTags";
import { Flags, NoFlags } from "./fiberFlags";
import { Container } from "hostConfig";
import { UpdateQueue } from "./updateQueue";

export class FiberNode {
  tag: WorkTag;
  key: Key;
  /** dom 引用 */
  stateNode: any;
  /** 组件类型 */
  type: any;

  /** 父节点 */
  return: FiberNode | null;
  /** 第一个子节点 */
  child: FiberNode | null;
  /** 兄弟节点 */
  sibling: FiberNode | null;
  /** 子节点位置 */
  index: number;
  /** ref */
  ref: Ref | null;

  /** 待处理的 props */
  pendingProps: Props;
  /** 已处理的 props */
  memoizedProps: Props | null;
  /** 已处理的 state */
  memoizedState: any;
  /** 更新队列 */
  updateQueue: UpdateQueue<any> | null;

  /** 备用 fiber 双缓存 */
  alternate: FiberNode | null;

  /** 副作用标记 */
  flags: Flags;
  subtreeFlags: Flags;

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    this.tag = tag;
    this.key = key;
    this.stateNode = null;
    this.type = null;

    // 形成树状结构
    this.return = null;
    this.child = null;
    this.sibling = null;
    this.index = 0;

    this.ref = null;

    // 作为工作单元
    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.memoizedState = null;
    this.updateQueue = null;

    this.alternate = null;

    // 副作用
    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;
  }
}

export class FiberRootNode {
  container: Container;
  current: FiberNode;
  finishedWork: FiberNode | null;
  constructor(container: Container, hostRootRiber: FiberNode) {
    this.container = container;
    this.current = hostRootRiber;
    hostRootRiber.stateNode = this;
    this.finishedWork = null;
  }
}

export const createFiberFormElement = (
  element: ReactElementType,
): FiberNode => {
  const { type, props, key } = element;
  let fiberTag: WorkTag = HostComponent;
  if (isString(type)) {
    // <div> type: 'div'
    fiberTag = HostComponent;
  } else if (!isFunction(type) && __DEV__) {
    console.warn("未定义的type 类型", element);
  }
  const fiber = new FiberNode(fiberTag, props, key);
  fiber.type = type;
  return fiber;
};
