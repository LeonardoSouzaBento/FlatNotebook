import { sampleDocument } from "@/data/sampleDocument";
import { Document } from "@/types/document";
import { StateSetter } from "@/types/react";
import { useState } from "react";
import { DocPageContext } from "./index";

export type DocPageContextType = {
  documents: Document[];
  setDocuments: StateSetter<Document[]>;
};

export const DocPageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [documents, setDocuments] = useState<Document[]>([sampleDocument]);

  return (
    <DocPageContext.Provider value={{ documents, setDocuments }}>
      {children}
    </DocPageContext.Provider>
  );
};
