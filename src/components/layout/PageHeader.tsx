import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  heading?: "h1" | "h2";
};

export function PageHeader({
  title,
  description,
  actions,
  heading = "h1",
}: PageHeaderProps) {
  const Heading = heading;

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <Heading className="text-2xl font-semibold tracking-tight text-text">
          {title}
        </Heading>
        {description ? (
          <p className="max-w-2xl text-sm text-text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}
