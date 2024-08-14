export const isFunction = (val: unknown): val is Function => {
  return typeof val === "function";
};

export const isObject = (val: unknown): val is Record<any, any> => {
  return val !== null && typeof val === "object";
};

export const isString = (val: unknown): val is string => {
  return typeof val === "string";
};

export const isNumber = (val: unknown): val is number => {
  return typeof val === "number";
};
