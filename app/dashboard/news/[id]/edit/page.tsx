"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/rich-text-editor";
import UploadImage from "@/components/uploadImage";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useGetNewsById, useCreateNews, useUpdateNews } from "@/features/news";
import type { CreateNewsDto, UpdateNewsDto } from "@/features/news/types";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const { data: news, isLoading: isLoadingNews } = useGetNewsById(id, !isNew);
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();

  const [formData, setFormData] = useState({
    title: { ka: "", en: "" },
    summary: { ka: "", en: "" },
    content: { ka: "", en: "" },
    imageUrl: "",
  });

  useEffect(() => {
    if (news && !isNew) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: news.title,
        summary: news.summary,
        content: news.content,
        imageUrl: news.imageUrl,
      });
    }
  }, [news, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error("გთხოვთ ატვირთოთ სურათი");
      return;
    }

    if (isNew) {
      createNews.mutate(formData as CreateNewsDto, {
        onSuccess: () => {
          router.push("/dashboard/news");
        },
      });
    } else {
      updateNews.mutate(
        { id, data: formData as UpdateNewsDto },
        {
          onSuccess: () => {
            router.push("/dashboard/news");
          },
        }
      );
    }
  };

  if (isLoadingNews && !isNew) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" /> იტვირთება...
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/news")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {isNew ? "სიახლის შექმნა" : "სიახლის რედაქტირება"}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {isNew
              ? "ახალი სიახლის დამატება"
              : "სიახლის ინფორმაციის განახლება"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>სათაური</Label>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label
                  htmlFor="title-ka"
                  className="text-sm text-muted-foreground"
                >
                  Georgian (ქართული)
                </Label>
                <Input
                  id="title-ka"
                  value={formData?.title?.ka}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: { ...formData.title, ka: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="title-en"
                  className="text-sm text-muted-foreground"
                >
                  ინგლისურად
                </Label>
                <Input
                  id="title-en"
                  value={formData?.title?.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: { ...formData.title, en: e.target.value },
                    })
                  }
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>შეჯამება</Label>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label
                  htmlFor="summary-ka"
                  className="text-sm text-muted-foreground"
                >
                  Georgian (ქართული)
                </Label>
                <Textarea
                  id="summary-ka"
                  value={formData?.summary?.ka}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      summary: { ...formData.summary, ka: e.target.value },
                    })
                  }
                  required
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="summary-en"
                  className="text-sm text-muted-foreground"
                >
                  ინგლისურად
                </Label>
                <Textarea
                  id="summary-en"
                  value={formData?.summary?.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      summary: { ...formData.summary, en: e.target.value },
                    })
                  }
                  required
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>შინაარსი</Label>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label
                  htmlFor="content-ka"
                  className="text-sm text-muted-foreground"
                >
                  Georgian (ქართული)
                </Label>
                <RichTextEditor
                  id="content-ka"
                  value={formData?.content?.ka || ""}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      content: { ...formData.content, ka: value },
                    })
                  }
                  placeholder="შეიყვანეთ შინაარსი ქართულად..."
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="content-en"
                  className="text-sm text-muted-foreground"
                >
                  ინგლისურად
                </Label>
                <RichTextEditor
                  id="content-en"
                  value={formData?.content?.en || ""}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      content: { ...formData.content, en: value },
                    })
                  }
                  placeholder="შეიყვანეთ შინაარსი ინგლისურად..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <UploadImage
            onImageChange={(url) => setFormData({ ...formData, imageUrl: url })}
            imageUrl={formData.imageUrl}
            defaultImageUrl={news?.imageUrl}
            label="სურათი"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/news")}
          >
            გაუქმება
          </Button>
          <Button
            type="submit"
            disabled={createNews.isPending || updateNews.isPending}
          >
            {createNews.isPending || updateNews.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isNew ? "შექმნა მიმდინარეობს..." : "განახლება მიმდინარეობს..."}
              </>
            ) : isNew ? (
              "შექმნა"
            ) : (
              "განახლება"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
