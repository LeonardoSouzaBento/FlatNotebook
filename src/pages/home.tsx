import {
  AddDocButton,
  AddDocModal,
  DocsGrid,
  PageHeader,
} from "@/components/home";
import { useDocPageContext } from "@/contexts";
import { Document } from "@/types/document";
import { useState } from "react";

const Home = () => {
  const { documents, setDocuments } = useDocPageContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  const handleCreateOrUpdate = () => {
    if (!newTitle.trim()) return;

    if (editingDocId) {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === editingDocId
            ? {
                ...doc,
                title: newTitle.trim(),
                subtitle: newSubtitle.trim() || undefined,
                updatedAt: new Date().toISOString(),
              }
            : doc,
        ),
      );
    } else {
      const newDoc: Document = {
        id: `doc_${Date.now()}`,
        title: newTitle.trim(),
        subtitle: newSubtitle.trim() || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        blocks: [
          {
            id: `block_${Date.now()}_intro`,
            level: 3,
            title: "Intro",
            content: [],
            collapsed: false,
            children: [],
          },
        ],
      };
      setDocuments((prev) => [...prev, newDoc]);
    }

    setNewTitle("");
    setNewSubtitle("");
    setEditingDocId(null);
    setModalOpen(false);
  };

  const handleOpenRename = (doc: Document) => {
    setNewTitle(doc.title);
    setNewSubtitle(doc.subtitle || "");
    setEditingDocId(doc.id);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <DocsGrid
        documents={documents}
        onDelete={handleDelete}
        onRename={handleOpenRename}
      />

      <AddDocButton
        onClick={() => {
          setNewTitle("");
          setNewSubtitle("");
          setEditingDocId(null);
          setModalOpen(true);
        }}
      />

      <AddDocModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newSubtitle={newSubtitle}
        setNewSubtitle={setNewSubtitle}
        onSubmit={handleCreateOrUpdate}
        isRename={!!editingDocId}
      />
    </div>
  );
};

export default Home;
