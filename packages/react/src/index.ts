import currentDispatcher, {
  type Dispatcher,
  type Dispatch,
  resolveDispatcher,
} from "./currentDispatcher";
export { currentDispatcher, Dispatcher, resolveDispatcher, Dispatch };
export * from "./jsx";

export const useState: Dispatcher["useState"] = (initialState: any) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
};

// 内部数据共享层
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  currentDispatcher,
};
