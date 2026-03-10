import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Document } from "@/types/document";
import { sampleDocument } from "@/data/sampleDocument";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([sampleDocument]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const newDoc: Document = {
      id: `doc_${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blocks: [],
    };
    setDocuments((prev) => [...prev, newDoc]);
    setNewTitle("");
    setNewSubtitle("");
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold text-foreground font-sans">FlatNotebook</h1>
          <p className="text-sm text-muted-foreground font-sans">Seus documentos</p>
        </div>
      </header>

      {/* Document grid */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => navigate(`/document/${doc.id}`)}
              className="text-left border border-border rounded-lg p-5 hover:bg-muted transition-colors bg-card"
            >
              <h2 className="font-semibold text-foreground font-sans text-base truncate">{doc.title}</h2>
              {doc.subtitle && (
                <p className="text-sm text-muted-foreground font-sans mt-1 truncate">{doc.subtitle}</p>
              )}
              <p className="text-xs text-muted-foreground/60 font-sans mt-3">
                {doc.blocks.length} {doc.blocks.length === 1 ? "capítulo" : "capítulos"}
              </p>
            </button>
          ))}
        </div>
      </main>

      {/* FAB */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="Novo documento"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Create document modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="font-sans">
          <DialogHeader>
            <DialogTitle className="font-sans">Novo documento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground font-sans block mb-1.5">Título *</label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Nome do documento"
                className="font-sans"
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground font-sans block mb-1.5">Subtítulo</label>
              <Input
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                placeholder="Subtítulo (opcional)"
                className="font-sans"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} className="font-sans">
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={!newTitle.trim()} className="font-sans">
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
