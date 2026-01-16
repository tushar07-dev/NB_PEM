interface MetaItemProps {
  label: string;
  value: string;
}

const MetaItem = ({ label, value }: MetaItemProps) => (
  <div className="flex items-baseline gap-2">
    <span className="text-sm whitespace-nowrap text-slate-400">{label}</span>
    <span className="text-sm font-semibold text-slate-700">{value}</span>
  </div>
);

export function ProjectMetaGrid({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-3 gap-x-12 gap-y-5">
      <MetaItem label="PEM Stage:" value={data.pemStage} />
      <MetaItem label="Discipline:" value={data.discipline} />
      <MetaItem label="Document Group:" value={data.docGroup} />
      <MetaItem label="Document Title:" value={data.docTitle} />
      <MetaItem label="Document Type:" value={data.docType} />
      <MetaItem label="Document Number:" value={data.docNumber} />
      <MetaItem label="Doc Revision:" value={data.revision} />
      <MetaItem label="Doc Issued For:" value={data.issuedFor} />
    </div>
  );
}
