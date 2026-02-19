"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { NewsTable } from "@/features/news/components/news-table";
import { useGetNews, useDeleteNews } from "@/features/news";
import { Pagination } from "@/components/pagination";
import { useRouter } from "next/navigation";

const limit = 20;
export default function NewsPage() {
  const [page, setPage] = useState(1);

  const router = useRouter();

  const { data, isLoading, error } = useGetNews(page, limit);
  const deleteNews = useDeleteNews();

  const handleCreate = () => {
    router.push("/dashboard/news/new/edit");
  };

  const handleDelete = async (id: string) => {
    if (confirm("დარწმუნებული ხართ, რომ გსურთ ამ სიახლის წაშლა?")) {
      deleteNews.mutate(id);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          სიახლეების ჩატვირთვის შეცდომა:{" "}
          {error instanceof Error ? error.message : "უცნობი შეცდომა"}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" /> იტვირთება...
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">სიახლეები</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            სიახლეების მართვა
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          სიახლის დამატება
        </Button>
      </div>

      <NewsTable news={data?.data || []} onDelete={handleDelete} />

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            ნაჩვენებია {(page - 1) * limit + 1}-დან{" "}
            {Math.min(page * limit, data.total)}-მდე, სულ {data.total} სტატია
          </div>
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
