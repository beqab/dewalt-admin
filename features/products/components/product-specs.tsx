"use client";

import { getIn, useField, useFormikContext } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { ProductSpec } from "../types";
import type { LocalizedText } from "@/features/categories/types";

export function ProductSpecs() {
  const [field, meta, helpers] = useField<ProductSpec[]>("specs");
  const { errors, touched, setFieldTouched } = useFormikContext<{
    specs?: ProductSpec[];
  }>();

  const specs = field.value || [];

  const isTouched = (path: string) => Boolean(getIn(touched, path));
  const getError = (path: string): string | undefined => {
    const err = getIn(errors, path);
    return typeof err === "string" ? err : undefined;
  };

  const addSpec = () => {
    const newSpec: ProductSpec = {
      label: { ka: "", en: "" },
      value: { ka: "", en: "" },
    };
    helpers.setValue([...specs, newSpec]);

    // Keep touched array in sync, so removing/adding doesn't misalign error display
    if (Array.isArray(meta.touched)) {
      helpers.setTouched(
        [
          ...meta.touched,
          {
            label: { ka: false, en: false },
            value: { ka: false, en: false },
          },
        ] as never,
        false
      );
    }
  };

  const removeSpec = (index: number) => {
    helpers.setValue(specs.filter((_, i) => i !== index));

    if (Array.isArray(meta.touched)) {
      helpers.setTouched(
        meta.touched.filter((_, i) => i !== index) as never,
        false
      );
    }
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
          <div className="space-y-1">
            <Input
              placeholder="დასახელება (EN)"
              value={spec.label.en}
              onChange={(e) =>
                updateSpec(index, "label", {
                  ...spec.label,
                  en: e.target.value,
                })
              }
              onBlur={() =>
                setFieldTouched(`specs[${index}].label.en`, true, false)
              }
            />
            {isTouched(`specs[${index}].label.en`) &&
              getError(`specs[${index}].label.en`) && (
                <p className="text-xs text-destructive">
                  {getError(`specs[${index}].label.en`)}
                </p>
              )}
          </div>

          <div className="space-y-1">
            <Input
              placeholder="დასახელება (KA)"
              value={spec.label.ka}
              onChange={(e) =>
                updateSpec(index, "label", {
                  ...spec.label,
                  ka: e.target.value,
                })
              }
              onBlur={() =>
                setFieldTouched(`specs[${index}].label.ka`, true, false)
              }
            />
            {isTouched(`specs[${index}].label.ka`) &&
              getError(`specs[${index}].label.ka`) && (
                <p className="text-xs text-destructive">
                  {getError(`specs[${index}].label.ka`)}
                </p>
              )}
          </div>

          <div className="space-y-1">
            <Input
              placeholder="მნიშვნელობა (EN)"
              value={spec?.value?.en}
              onChange={(e) =>
                updateSpec(index, "value", {
                  ...spec?.value,
                  en: e.target.value,
                })
              }
              onBlur={() =>
                setFieldTouched(`specs[${index}].value.en`, true, false)
              }
            />
            {isTouched(`specs[${index}].value.en`) &&
              getError(`specs[${index}].value.en`) && (
                <p className="text-xs text-destructive">
                  {getError(`specs[${index}].value.en`)}
                </p>
              )}
          </div>

          <div className="space-y-1">
            <Input
              placeholder="მნიშვნელობა (KA)"
              value={spec?.value?.ka}
              onChange={(e) =>
                updateSpec(index, "value", {
                  ...spec?.value,
                  ka: e.target.value,
                })
              }
              onBlur={() =>
                setFieldTouched(`specs[${index}].value.ka`, true, false)
              }
            />
            {isTouched(`specs[${index}].value.ka`) &&
              getError(`specs[${index}].value.ka`) && (
                <p className="text-xs text-destructive">
                  {getError(`specs[${index}].value.ka`)}
                </p>
              )}
          </div>
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
