// src/features/pem-check-lists/pages/components/_flow-shared/YellowNote.tsx

interface YellowNoteProps {
  message?: string;
}

export function YellowNote({ message }: YellowNoteProps) {
  return (
    <div className="flex flex-col gap-[3px] rounded-[10px] border border-[#FFF3A7] bg-[#FFFED6] px-[12px] py-[8px] lg:rounded-[12px] lg:px-[16px] lg:py-[12px]">
      <p className="text-sm font-medium text-[#F04438]">Note:</p>
      <p className="text-primary-500 text-sm leading-snug">
        {message ??
          "Please ensure that the names you fill in match those provided in the document."}
      </p>
    </div>
  );
}
