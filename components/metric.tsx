import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("flex flex-col gap-1", className)}>{children}</div>;
}

function Label({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("text-muted-foreground text-sm", className)}>
      {children}
    </span>
  );
}

export function Metric({
  className,
  href,
  label,
  value,
  fallback = "None",
}: {
  className?: string;
  href?: string;
  label: string;
  value: string | string[] | null | undefined;
  fallback?: string;
}) {
  // Handle null/undefined values
  if (value === null || value === undefined || value === "") {
    return (
      <Container className={className}>
        <Label>{label}</Label>
        <p className="text-[16px]">{fallback}</p>
      </Container>
    );
  }

  // Handle array values
  if (Array.isArray(value)) {
    // Filter out null/undefined values and format each item
    const filteredItems = value.filter(
      (item) => item !== null && item !== undefined && item !== ""
    );

    if (filteredItems.length === 0) {
      return (
        <Container className={className}>
          <Label>{label}</Label>
          <p className="text-[16px]">{fallback}</p>
        </Container>
      );
    }

    return (
      <Container className={className}>
        <Label>{label}</Label>
        <div className="flex flex-wrap gap-2">
          {filteredItems.map((item, index) => (
            <Badge
              key={`${label}-${index}`}
              variant="secondary"
              className="capitalize"
            >
              {item}
            </Badge>
          ))}
        </div>
      </Container>
    );
  }

  // Handle href values
  if (href) {
    return (
      <Container className={className}>
        <Label>{label}</Label>
        <a
          className="text-[16px] flex items-center gap-1 underline"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {value || fallback}
          <ExternalLink className="size-3.5" />
        </a>
      </Container>
    );
  }

  // Handle regular string values
  return (
    <Container className={className}>
      <Label>{label}</Label>
      <p className="text-[16px]">{value}</p>
    </Container>
  );
}
