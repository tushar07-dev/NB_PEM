// src/features/pem-check-lists/pages/components/_flow-shared/YellowNote.tsx

interface YellowNoteProps {
  message?: string;
}

export function YellowNote({ message }: YellowNoteProps) {
  return (
    <div className="bg-yellow-50 border-yellow-50 flex flex-col gap-1 rounded-xl border px-3 py-2 lg:rounded-xl lg:px-4 lg:py-3">
      <p className="text-error-500 text-sm font-medium">Note:</p>
      <p className="text-primary-500 text-sm leading-snug">
        {message ??
          "Please ensure that the names you fill in match those provided in the document."}
      </p>
    </div>
  );
}
