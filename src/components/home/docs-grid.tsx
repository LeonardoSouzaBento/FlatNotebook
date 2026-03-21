import { Document } from "@/types/document";
import { Link } from "react-router-dom";

interface DocsGridProps {
  documents: Document[];
}

export const DocsGrid = ({ documents }: DocsGridProps) => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Link
            key={doc.id}
            to={`/document/${doc.id}`}
            className="text-left rounded-lg p-5 transition-colors shadow-xs
            border border-border/50 bg-primary-50 hover:bg-primary-100/45"
          >
            <h6 className="font-medium text-foreground text-base truncate mb-1">
              {doc.title}
            </h6>
            {doc.subtitle && (
              <p className="text-sm-button text-muted-foreground truncate font-[375]">
                {doc.subtitle}
              </p>
            )}
            <p className="text-xs text-muted-foreground/60 mt-3 font-[375]">
              {doc.blocks.length}{" "}
              {doc.blocks.length === 1 ? "capítulo" : "capítulos"}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
};
