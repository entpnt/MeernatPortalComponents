interface GenericContentProps {
  title: string;
  description: string;
}

export function GenericContent({ title, description }: GenericContentProps) {
  return (
    <div className="p-4 md:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#F8FAFC]">{title}</h1>
        <p className="text-sm md:text-base text-[#94A3B8]">{description}</p>
      </div>
      <div className="mt-6 md:mt-8 bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
        <p className="text-[var(--muted-foreground)]">{title} content will be displayed here.</p>
      </div>
    </div>
  );
}