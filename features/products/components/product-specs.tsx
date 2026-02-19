"use client";

import { useField } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { ProductSpec } from "../types";
import type { LocalizedText } from "@/features/categories/types";

export function ProductSpecs() {
  const [field, , helpers] = useField<ProductSpec[]>("specs");

  const specs = field.value || [];

  const addSpec = () => {
    const newSpec: ProductSpec = {
      label: { ka: "", en: "" },
      value: { ka: "", en: "" },
    };
    helpers.setValue([...specs, newSpec]);
  };

  const removeSpec = (index: number) => {
    helpers.setValue(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (
    index: number,
    field: keyof ProductSpec,
    value: string | number | LocalizedText
  ) => {
    const updatedSpecs = [...specs];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    helpers.setValue(updatedSpecs);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>მახასიათებლები</Label>
        <Button type="button" variant="outline" size="sm" onClick={addSpec}>
          <Plus className="h-4 w-4 mr-2" />
          მახასიათებლის დამატება
        </Button>
      </div>
      {specs.map((spec, index) => (
        <div key={index} className="grid grid-cols-5 gap-2 p-2 border rounded">
          <Input
            placeholder="დასახელება (EN)"
            value={spec.label.en}
            onChange={(e) =>
              updateSpec(index, "label", {
                ...spec.label,
                en: e.target.value,
              })
            }
          />
          <Input
            placeholder="დასახელება (KA)"
            value={spec.label.ka}
            onChange={(e) =>
              updateSpec(index, "label", {
                ...spec.label,
                ka: e.target.value,
              })
            }
          />
          <Input
            placeholder="მნიშვნელობა (EN)"
            value={spec?.value?.en}
            onChange={(e) =>
              updateSpec(index, "value", {
                ...spec?.value,
                en: e.target.value,
              })
            }
          />
          <Input
            placeholder="მნიშვნელობა (KA)"
            value={spec?.value?.ka}
            onChange={(e) =>
              updateSpec(index, "value", {
                ...spec?.value,
                ka: e.target.value,
              })
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeSpec(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
