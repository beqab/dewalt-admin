"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetFinaProductsList, type FinaProductListItem } from "@/features/fina";

export function FinaProductPicker({
  onSelect,
  className,
}: {
  onSelect: (item: FinaProductListItem) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data, isFetching, isError, error, refetch } = useGetFinaProductsList({
    enabled: open,
  });

  const filtered = useMemo(() => {
    const list = data || [];
    const q = query.trim().toLowerCase();
    if (!q) return list.slice(0, 50);

    const out: FinaProductListItem[] = [];
    for (const item of list) {
      const hay = `${item.code ?? ""} ${item.name ?? ""}`.toLowerCase();
      if (hay.includes(q)) out.push(item);
      if (out.length >= 50) break;
    }
    return out;
  }, [data, query]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Hide FINA picker" : "Pick from FINA"}
        </Button>

        {open && (
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Refresh
          </Button>
        )}

        {open && isFetching && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>

      {open && (
        <>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FINA by code or name..."
          />

          {isError && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              Failed to load FINA products.
              <div className="mt-1 text-xs opacity-80">
                {error instanceof Error ? error.message : "Unknown error"}
              </div>
            </div>
          )}

          <div className="max-h-72 overflow-y-auto rounded-md border">
            {filtered.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">
                No results.
              </div>
            ) : (
              <div className="divide-y">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="flex w-full items-start justify-between gap-3 p-3 text-left hover:bg-accent"
                    onClick={() => {
                      onSelect(p);
                      setOpen(false);
                    }}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {p.code || `FINA #${p.id}`}
                      </div>
                      {p.name && (
                        <div className="truncate text-xs text-muted-foreground">
                          {p.name}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 text-xs text-muted-foreground">
                      #{p.id}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Showing up to 50 results. Refine search to narrow down.
          </div>
        </>
      )}
    </div>
  );
}

