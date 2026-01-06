"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Category } from "../types";

interface CategorySelectorProps {
  categories?: Category[];
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  filterByBrandIds?: string[];
}

export function CategorySelector({
  categories,
  value,
  onValueChange,
  label = "Select Category",
  placeholder = "Select a category",
  id = "category-select",
  disabled = false,
  filterByBrandIds,
}: CategorySelectorProps) {
  const availableCategories = categories?.filter((category) => {
    if (filterByBrandIds && filterByBrandIds.length > 0) {
      const categoryBrandIds = Array.isArray(category.brandIds)
        ? category.brandIds.map((b) => (typeof b === "string" ? b : b._id))
        : [];
      return filterByBrandIds.some((brandId) =>
        categoryBrandIds.includes(brandId)
      );
    }
    return true;
  });

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value || ""}
        onValueChange={(val) => onValueChange(val || undefined)}
        disabled={disabled}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {availableCategories?.map((category) => (
            <SelectItem key={category._id} value={category._id}>
              {category.name.en}
            </SelectItem>
          ))}
          {filterByBrandIds && filterByBrandIds.length > 0 && availableCategories?.length === 0 && (
            <div className="p-2 text-sm text-muted-foreground">
              No categories available for selected brands
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

