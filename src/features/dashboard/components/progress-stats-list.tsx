export function ProgressStatsList({
  yes,
  no,
  na,
}: {
  yes: number;
  no: number;
  na: number;
}) {
  const StatRow = ({ label, value }: { label: string; value: number }) => (
    <div className="flex w-32 items-center justify-between">
      <span className="text-xs font-medium text-slate-400">{label} :</span>
      <span className="text-sm font-bold text-slate-700">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <p className="mb-1 text-xs font-bold text-slate-500">Progress :</p>
      <StatRow label="No Of Yes" value={yes} />
      <StatRow label="No Of No" value={no} />
      <StatRow label="No Of N/A" value={na} />
    </div>
  );
}
