"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Edit } from "lucide-react";
import Image from "next/image";
import { useGetNewsById } from "@/features/news";

export default function PreviewNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: news, isLoading, error } = useGetNewsById(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" /> იტვირთება...
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          {error instanceof Error
            ? error.message
            : "სიახლის ჩატვირთვა ვერ მოხერხდა"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/news")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">სიახლის გადახედვა</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              სიახლის გადახედვა
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/news/${id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          რედაქტირება
        </Button>
      </div>

      <div className="space-y-6">
        {/* Image */}
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border">
          <Image
            src={news.imageUrl}
            alt={news.title.en || "სიახლის სურათი"}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">{news.title.en}</h2>
            <h2 className="text-2xl font-semibold text-muted-foreground">
              {news.title.ka}
            </h2>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">შეჯამება</h3>
          <div className="space-y-3">
            <p className="text-base leading-relaxed">{news.summary.en}</p>
            <p className="text-base leading-relaxed text-muted-foreground">
              {news.summary.ka}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">შინაარსი</h3>
          <div className="space-y-3">
            <div
              className="text-base leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: news.content.en }}
            />
            <div
              className="text-base leading-relaxed text-muted-foreground prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: news.content.ka }}
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t text-sm text-muted-foreground">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">შექმნილია:</span>{" "}
              {new Date(news.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">განახლებულია:</span>{" "}
              {new Date(news.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

