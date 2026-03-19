import React, { useState } from "react";
import { Document } from "@/types/document";
import { sampleDocument } from "@/data/sampleDocument";
import {
  Header,
  DocsGrid,
  AddDocButton,
  AddDocModal,
} from "@/components/home";

const Home = () => {
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
      <Header />

      <DocsGrid documents={documents} />

      <AddDocButton onClick={() => setModalOpen(true)} />

      <AddDocModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newSubtitle={newSubtitle}
        setNewSubtitle={setNewSubtitle}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default Home;

