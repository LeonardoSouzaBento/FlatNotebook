import { Document } from "@/types/document";
import { Link } from "react-router-dom";

interface DocsGridProps {
  documents: Document[];
}

export const DocsGrid = ({ documents }: DocsGridProps) => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Link
            key={doc.id}
            to={`/document/${doc.id}`}
            className="text-left rounded-lg p-5 transition-colors 
            border border-border/50 bg-primary-50 hover:bg-primary-100/45"
          >
            <h6 className="font-semibold text-foreground font-sans text-base truncate mb-1">
              {doc.title}
            </h6>
            {doc.subtitle && (
              <p className="text-sm-button text-muted-foreground font-sans truncate">
                {doc.subtitle}
              </p>
            )}
            <p className="text-xs text-muted-foreground/60 font-sans mt-3">
              {doc.blocks.length}{" "}
              {doc.blocks.length === 1 ? "capítulo" : "capítulos"}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
};
