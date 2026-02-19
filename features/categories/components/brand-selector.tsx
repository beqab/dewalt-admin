"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Brand } from "../types";

interface BrandSelectorProps {
  brands?: Brand[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  id?: string;
}

export function BrandSelector({
  brands,
  value,
  onValueChange,
  label = "ბრენდის არჩევა",
  placeholder = "აირჩიეთ ბრენდი",
  id = "brand-select",
}: BrandSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {brands?.map((brand) => (
            <SelectItem key={brand._id} value={brand._id}>
              {brand.name.en}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

