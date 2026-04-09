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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UploadImage from "@/components/uploadImage";
import RichTextEditorContent from "@/components/rich-text-editor-content";
import {
  useGetServiceCenter,
  useUpdateServiceCenter,
  type ServiceCenter,
} from "@/features/serviceCenter";

type FormState = {
  heroTitleKa: string;
  heroTitleEn: string;
  contentKa: string;
  contentEn: string;
  imageUrl: string;
};

function toForm(initial: ServiceCenter): FormState {
  return {
    heroTitleKa: initial.heroTitle?.ka ?? "",
    heroTitleEn: initial.heroTitle?.en ?? "",
    contentKa: initial.content?.ka ?? "",
    contentEn: initial.content?.en ?? "",
    imageUrl: initial.imageUrl ?? "",
  };
}

function ServiceCenterForm({ initial }: { initial: ServiceCenter }) {
  const update = useUpdateServiceCenter();
  const [form, setForm] = useState<FormState>(() => toForm(initial));

  const onSave = async () => {
    await update.mutateAsync({
      heroTitle: { ka: form.heroTitleKa, en: form.heroTitleEn },
      content: { ka: form.contentKa, en: form.contentEn },
      imageUrl: form.imageUrl.trim() || undefined,
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">სერვის ცენტრი</h2>
          <p className="text-sm text-muted-foreground">
            სათაური, ტექსტი და სურათი გამოჩნდება საიტის სერვის ცენტრის გვერდზე.
          </p>
        </div>
        <Button onClick={onSave} disabled={update.isPending}>
          {update.isPending ? "შენახვა..." : "შენახვა"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>სათაური</CardTitle>
          <CardDescription>
            ჰედერის ერთი ხაზი ორივე ენაზე (არასავალდებულო).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="heroKa">სათაური (ქართული)</Label>
            <Input
              id="heroKa"
              value={form.heroTitleKa}
              onChange={(e) =>
                setForm((p) => ({ ...p, heroTitleKa: e.target.value }))
              }
              placeholder="მაგ. Dewalt Service Center..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroEn">სათაური (English)</Label>
            <Input
              id="heroEn"
              value={form.heroTitleEn}
              onChange={(e) =>
                setForm((p) => ({ ...p, heroTitleEn: e.target.value }))
              }
              placeholder="e.g. Dewalt Service Center..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>სურათი</CardTitle>
          <CardDescription>
            ატვირთეთ სურათი ან დატოვეთ ცარიელი — საიტზე გამოჩნდება default
            სურათი.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadImage
            imageUrl={form.imageUrl}
            onImageChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
            defaultImageUrl={initial.imageUrl}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ტექსტი</CardTitle>
          <CardDescription>
            მთავარი კონტენტი rich text-ით. ცარიელი ველის შემთხვევაში საიტზე
            ჩანს ძველი სტატიკური ტექსტი.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>ტექსტი (ქართული)</Label>
            <RichTextEditorContent
              value={form.contentKa}
              onChange={(v) => setForm((p) => ({ ...p, contentKa: v }))}
              placeholder="სერვის ცენტრის ტექსტი ქართულად"
            />
          </div>
          <div className="space-y-2">
            <Label>ტექსტი (English)</Label>
            <RichTextEditorContent
              value={form.contentEn}
              onChange={(v) => setForm((p) => ({ ...p, contentEn: v }))}
              placeholder="Service center content in English"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ServiceCenterAdminPage() {
  const { data, isLoading, error } = useGetServiceCenter();

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-destructive">
          ჩატვირთვის შეცდომა:{" "}
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

  return (
    <ServiceCenterForm
      key={data.updatedAt ?? data._id ?? "service-center"}
      initial={data}
    />
  );
}
