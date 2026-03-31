"use client";

import { useMemo, useState } from "react";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { ChildCategory } from "../types";

interface ChildCategoriesTableProps {
  childCategories: ChildCategory[];
  onEdit: (childCategory: ChildCategory) => void;
  onDelete: (id: string) => void;
  onReorder?: (childCategoryIds: string[]) => void;
  isReordering?: boolean;
}

function SortableRow({
  childCategory,
  onEdit,
  onDelete,
}: {
  childCategory: ChildCategory;
  onEdit: (childCategory: ChildCategory) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: childCategory._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const category =
    childCategory.categoryId && typeof childCategory.categoryId === "object"
      ? childCategory.categoryId
      : null;

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-10">
        <button
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium text-sm">{childCategory.name.en}</div>
          <div className="text-xs text-muted-foreground">
            {childCategory.name.ka}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm font-mono">{childCategory.slug}</div>
      </TableCell>
      <TableCell>
        {Array.isArray(childCategory.brandIds) && childCategory.brandIds.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {childCategory.brandIds.map((brand) => {
              return (
                <span key={brand._id} className="text-xs px-2 py-1 rounded bg-muted">
                  {brand.name.en}
                </span>
              );
            })}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">არ არის მინიჭებული</span>
        )}
      </TableCell>
      <TableCell>
        {category ? (
          <span className="text-xs px-2 py-1 rounded bg-muted">{category.name.en}</span>
        ) : (
          <span className="text-xs text-muted-foreground">არ არის მინიჭებული</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(childCategory)}
            title="რედაქტირება"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(childCategory._id)}
            title="წაშლა"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function ChildCategoriesTable({
  childCategories,
  onEdit,
  onDelete,
  onReorder,
  isReordering,
}: ChildCategoriesTableProps) {
  const [localOrder, setLocalOrder] = useState<ChildCategory[] | null>(null);

  const displayChildCategories = localOrder ?? childCategories;
  const itemIds = useMemo(
    () => displayChildCategories.map((item) => item._id),
    [displayChildCategories]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = displayChildCategories.findIndex((item) => item._id === active.id);
    const newIndex = displayChildCategories.findIndex((item) => item._id === over.id);
    const reordered = arrayMove(displayChildCategories, oldIndex, newIndex);

    setLocalOrder(reordered);
    onReorder?.(reordered.map((item) => item._id));
  }

  return (
    <div className="rounded-md border">
      {isReordering && (
        <div className="px-4 py-2 bg-muted/50 text-sm text-muted-foreground border-b">
          თანმიმდევრობა ინახება...
        </div>
      )}
      <div className="overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>დასახელება (EN / KA)</TableHead>
                <TableHead>სლაგი</TableHead>
                <TableHead>ბრენდები</TableHead>
                <TableHead>კატეგორია</TableHead>
                <TableHead className="text-right">მოქმედებები</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayChildCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    ქვე-კატეგორიები ვერ მოიძებნა.
                  </TableCell>
                </TableRow>
              ) : (
                <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                  {displayChildCategories.map((childCategory) => (
                    <SortableRow
                      key={childCategory._id}
                      childCategory={childCategory}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </SortableContext>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
    </div>
  );
}
