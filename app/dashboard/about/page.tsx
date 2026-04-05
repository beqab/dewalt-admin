"use client";

import { useState, type ChangeEvent } from "react";
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
import RichTextEditorContent from "@/components/rich-text-editor-content";
import {
  useGetSettings,
  useUpdateSettings,
  type Settings,
} from "@/features/settings";

type AboutFormState = {
  titleKa: string;
  titleEn: string;
  subtitleKa: string;
  subtitleEn: string;
  contentKa: string;
  contentEn: string;
};

function AboutForm({ initial }: { initial: Settings }) {
  const updateSettings = useUpdateSettings();

  const [form, setForm] = useState<AboutFormState>(() => ({
    titleKa: initial.aboutTitle?.ka ?? "",
    titleEn: initial.aboutTitle?.en ?? "",
    subtitleKa: initial.aboutSubtitle?.ka ?? "",
    subtitleEn: initial.aboutSubtitle?.en ?? "",
    contentKa: initial.aboutContent?.ka ?? "",
    contentEn: initial.aboutContent?.en ?? "",
  }));

  const updateField =
    (key: keyof AboutFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const onSave = async () => {
    await updateSettings.mutateAsync({
      aboutTitle: {
        ka: form.titleKa,
        en: form.titleEn,
      },
      aboutSubtitle: {
        ka: form.subtitleKa,
        en: form.subtitleEn,
      },
      aboutContent: {
        ka: form.contentKa,
        en: form.contentEn,
      },
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">ჩვენ შესახებ</h2>
          <p className="text-sm text-muted-foreground">
            მართეთ about გვერდის სათაური, ქვე სათაური და ტექსტი.
          </p>
        </div>
        <Button onClick={onSave} disabled={updateSettings.isPending}>
          {updateSettings.isPending ? "შენახვა..." : "შენახვა"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>სათაური და ქვე სათაური</CardTitle>
          <CardDescription>
            ყველა ველი არასავალდებულოა და შეგიძლიათ ცარიელიც დატოვოთ.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="aboutTitleKa">სათაური (ქართული)</Label>
              <Input
                id="aboutTitleKa"
                value={form.titleKa}
                onChange={updateField("titleKa")}
                placeholder="მაგ. EAGLE POWER TOOLS"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aboutTitleEn">სათაური (English)</Label>
              <Input
                id="aboutTitleEn"
                value={form.titleEn}
                onChange={updateField("titleEn")}
                placeholder="EAGLE POWER TOOLS"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aboutSubtitleKa">ქვე სათაური (ქართული)</Label>
              <Input
                id="aboutSubtitleKa"
                value={form.subtitleKa}
                onChange={updateField("subtitleKa")}
                placeholder="ქვე სათაური"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aboutSubtitleEn">ქვე სათაური (English)</Label>
              <Input
                id="aboutSubtitleEn"
                value={form.subtitleEn}
                onChange={updateField("subtitleEn")}
                placeholder="Subtitle"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ტექსტი</CardTitle>
          <CardDescription>
            გამოიყენეთ editor ტექსტის ფორმატირებისთვის. ველი არასავალდებულოა.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>ტექსტი (ქართული)</Label>
            <RichTextEditorContent
              value={form.contentKa}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, contentKa: value }))
              }
              placeholder="About გვერდის ტექსტი ქართულად"
            />
          </div>
          <div className="space-y-2">
            <Label>ტექსტი (English)</Label>
            <RichTextEditorContent
              value={form.contentEn}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, contentEn: value }))
              }
              placeholder="About page content in English"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AboutAdminPage() {
  const { data, isLoading, error } = useGetSettings();

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-destructive">
          პარამეტრების ჩატვირთვის შეცდომა:{" "}
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

  return <AboutForm key={data.updatedAt ?? data._id ?? "about"} initial={data} />;
}
