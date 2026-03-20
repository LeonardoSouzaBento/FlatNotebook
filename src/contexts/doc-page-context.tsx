import { useState } from "react";
import { DocPageContext } from "./index";
import { sampleDocument } from "@/data/sampleDocument";
import { Document } from "@/types/document";
import { StateSetter } from "@/types/react";

export type DocPageContextType = {
  documents: Document[];
  setDocuments: StateSetter<Document[]>;
  doc: Document | null;
  setDoc: StateSetter<Document | null>;
};

export const DocPageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [documents, setDocuments] = useState<Document[]>([sampleDocument]);
  const [doc, setDoc] = useState<Document | null>(null);

  return (
    <DocPageContext.Provider value={{ documents, setDocuments, doc, setDoc }}>
      {children}
    </DocPageContext.Provider>
  );
};
