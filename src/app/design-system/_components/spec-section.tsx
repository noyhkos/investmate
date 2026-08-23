interface SpecSectionProps {
  id: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}

/** One rule per section, stated before it is demonstrated. */
export function SpecSection({ id, title, intro, children }: SpecSectionProps) {
  return (
    <section id={id} className="border-rule scroll-mt-20 border-t py-10 first:border-t-0 first:pt-0">
      <h2 className="text-foreground text-[1rem] font-medium">{title}</h2>
      {intro ? (
        <p className="text-muted-foreground mt-2 max-w-2xl text-[0.8125rem] leading-relaxed">
          {intro}
        </p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}
