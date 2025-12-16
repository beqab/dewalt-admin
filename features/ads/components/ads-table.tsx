"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Ad, AdPosition } from "../types";

interface AdsTableProps {
  ads: Ad[];
  onEdit: (ad: Ad) => void;
  onDelete: (id: string) => void;
}

const positionLabels: Record<AdPosition, string> = {
  main_page: "Main Page",
  aside: "Aside",
  footer: "Footer",
};

export function AdsTable({ ads, onEdit, onDelete }: AdsTableProps) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Image</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Link URL</TableHead>
              <TableHead className="w-32">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No ads found.
                </TableCell>
              </TableRow>
            ) : (
              ads.map((ad) => (
                <TableRow key={ad._id}>
                  <TableCell>
                    <div className="relative w-24 h-16 border rounded-md overflow-hidden bg-muted">
                      <Image
                        src={ad.imageUrl}
                        alt={`Ad ${positionLabels[ad.position]}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {positionLabels[ad.position]}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {ad.urlLink || <span className="italic">No link</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(ad)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(ad._id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
