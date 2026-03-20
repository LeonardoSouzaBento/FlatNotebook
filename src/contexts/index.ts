import { createContext, useContext } from "react";
import type { DocPageContextType } from "./doc-page-context";

export const DocPageContext = createContext<DocPageContextType | null>(null);
export const useDocPageContext = () => {
  return useContext(DocPageContext);
};
