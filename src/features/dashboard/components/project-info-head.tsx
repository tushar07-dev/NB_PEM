export function ProjectInfoHead({ title }: { title: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
        Project Name :
      </p>
      <h1 className="font-serif text-4xl tracking-tight text-slate-800">
        {title}
      </h1>
    </div>
  );
}
