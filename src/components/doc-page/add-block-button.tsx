export const AddBlockButton = ({ addChapter }: { addChapter: () => void }) => {
  return (
    <button
      onClick={addChapter}
      className="fixed bottom-8 right-8 w-14 h-14 bg-fab-bg hover:bg-fab-hover text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      aria-label="Adicionar capítulo"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
};
