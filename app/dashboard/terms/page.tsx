"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import RichTextEditorContent from "@/components/rich-text-editor-content";
import { useGetTerms, useUpdateTerms, type Terms } from "@/features/terms";

type TermsFormState = {
  contentKa: string;
  contentEn: string;
};

function TermsForm({ initial }: { initial: Terms }) {
  const updateTerms = useUpdateTerms();
  const [form, setForm] = useState<TermsFormState>(() => ({
    contentKa: initial.content?.ka ?? "",
    contentEn: initial.content?.en ?? "",
  }));

  const onSave = async () => {
    await updateTerms.mutateAsync({
      content: {
        ka: form.contentKa,
        en: form.contentEn,
      },
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">ტერმსები</h2>
          <p className="text-sm text-muted-foreground">
            აქედან მართავთ Terms & Conditions გვერდის ტექსტს.
          </p>
        </div>
        <Button onClick={onSave} disabled={updateTerms.isPending}>
          {updateTerms.isPending ? "შენახვა..." : "შენახვა"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions კონტენტი</CardTitle>
          <CardDescription>
            გამოიყენეთ editor ფორმატირებისთვის. ტექსტი გამოჩნდება front-ის terms
            გვერდზე.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>კონტენტი (ქართული)</Label>
            <RichTextEditorContent
              value={form.contentKa}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, contentKa: value }))
              }
              placeholder="Terms გვერდის ტექსტი ქართულად"
            />
          </div>

          <div className="space-y-2">
            <Label>კონტენტი (English)</Label>
            <RichTextEditorContent
              value={form.contentEn}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, contentEn: value }))
              }
              placeholder="Terms page content in English"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TermsAdminPage() {
  const { data, isLoading, error } = useGetTerms();

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-destructive">
          ტერმსების ჩატვირთვის შეცდომა:{" "}
          {error instanceof Error ? error.message : "უცნობი შეცდომა"}
        </p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">იტვირთება...</p>
      </div>
    );
  }

  return <TermsForm key={data.updatedAt ?? data._id ?? "terms"} initial={data} />;
}
