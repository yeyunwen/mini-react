import { createContainer, updateContainer } from "react-reconciler";
import { Container } from "./hostConfig";
import { ReactElementType } from "shared";

export const createRoot = (container: Container) => {
  const root = createContainer(container);
  return {
    render(element: ReactElementType) {
      updateContainer(element, root);
    },
  };
};
