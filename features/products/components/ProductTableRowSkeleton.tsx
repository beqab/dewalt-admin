import { TableCell } from "@/components/ui/table";

import { TableRow } from "@/components/ui/table";

export default function TableRowSkeleton({
  numberOfRows,
}: {
  numberOfRows: number;
}) {
  return Array.from({ length: numberOfRows }).map((_, index) => (
    <TableRow key={index}>
      <TableCell>
        <div className="space-y-1">
          <div className="h-4 bg-muted animate-pulse rounded w-16" />
          <div className="h-3 bg-muted animate-pulse rounded w-12" />
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted animate-pulse rounded w-20" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted animate-pulse rounded w-24" />
      </TableCell>
      <TableCell>
        <div className="h-6 bg-muted animate-pulse rounded w-16" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted animate-pulse rounded w-20" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
        </div>
      </TableCell>
    </TableRow>
  ));
}
