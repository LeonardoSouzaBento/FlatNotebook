import React from "react";
import { useNavigate } from "react-router-dom";
import { Document } from "@/types/document";

interface DocsGridProps {
  documents: Document[];
}

export const DocsGrid = ({ documents }: DocsGridProps) => {
  const navigate = useNavigate();

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => navigate(`/document/${doc.id}`)}
            className="text-left border border-border rounded-lg p-5 hover:bg-muted transition-colors bg-card"
          >
            <h2 className="font-semibold text-foreground font-sans text-base truncate">
              {doc.title}
            </h2>
            {doc.subtitle && (
              <p className="text-sm text-muted-foreground font-sans mt-1 truncate">
                {doc.subtitle}
              </p>
            )}
            <p className="text-xs text-muted-foreground/60 font-sans mt-3">
              {doc.blocks.length}{" "}
              {doc.blocks.length === 1 ? "capítulo" : "capítulos"}
            </p>
          </button>
        ))}
      </div>
    </main>
  );
};
