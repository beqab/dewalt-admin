"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Brand } from "../types";

interface BrandMultiSelectorProps {
  brands?: Brand[];
  selectedBrandIds: string[];
  onSelectionChange: (brandIds: string[]) => void;
  label?: string;
  showCurrentBrands?: boolean;
  onRemoveBrand?: (brandId: string) => void;
}

export function BrandMultiSelector({
  brands,
  selectedBrandIds,
  onSelectionChange,
  label = "Select Brands",
  showCurrentBrands = false,
  onRemoveBrand,
}: BrandMultiSelectorProps) {
  const handleBrandToggle = (brandId: string) => {
    if (selectedBrandIds.includes(brandId)) {
      onSelectionChange(selectedBrandIds.filter((id) => id !== brandId));
    } else {
      onSelectionChange([...selectedBrandIds, brandId]);
    }
  };

  const availableBrands = brands?.filter(
    (brand) => !selectedBrandIds.includes(brand._id)
  );

  return (
    <div className="space-y-2">
      {showCurrentBrands && selectedBrandIds.length > 0 && (
        <div className="space-y-2">
          <Label>Current Brands</Label>
          <div className="space-y-2">
            {selectedBrandIds.map((brandId) => {
              const brand = brands?.find((b) => b._id === brandId);
              if (!brand) return null;
              return (
                <div
                  key={brandId}
                  className="flex items-center justify-between p-2 border rounded bg-muted/50"
                >
                  <span className="text-sm font-medium">{brand.name.en}</span>
                  {onRemoveBrand && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveBrand(brandId)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      ×
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showCurrentBrands && (
        <div className="space-y-2">
          <Label>Add Brands</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
            {availableBrands && availableBrands.length > 0 ? (
              availableBrands.map((brand) => (
                <Button
                  key={brand._id}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleBrandToggle(brand._id)}
                  className="w-full justify-start"
                >
                  + {brand.name.en}
                </Button>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">
                All brands are assigned
              </p>
            )}
          </div>
        </div>
      )}

      {!showCurrentBrands && (
        <>
          <Label>{label}</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
            {brands?.map((brand) => (
              <div
                key={brand._id}
                className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded"
              >
                <Checkbox
                  id={`brand-${brand._id}`}
                  checked={selectedBrandIds.includes(brand._id)}
                  onCheckedChange={() => handleBrandToggle(brand._id)}
                />
                <label
                  htmlFor={`brand-${brand._id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {brand.name.en}
                </label>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

