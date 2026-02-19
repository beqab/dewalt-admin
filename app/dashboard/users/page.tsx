"use client";

import { useState } from "react";
import { UsersTable } from "@/features/users/components/users-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/pagination";
import { useGetUsers } from "@/features/users";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useGetUsers({ page, limit, search });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">მომხმარებლები</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            მომხმარებლებისა და მათი უფლებების მართვა
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="search">ელ.ფოსტით ძიება</Label>
          <Input
            id="search"
            placeholder="მაგ.: example@gmail.com"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          მომხმარებლების ჩატვირთვა ვერ მოხერხდა:{" "}
          {error instanceof Error ? error.message : "უცნობი შეცდომა"}
        </div>
      ) : (
        <>
          <UsersTable users={data?.data || []} />

          {isLoading && (
            <div className="text-sm text-muted-foreground">იტვირთება...</div>
          )}

          {data && data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                ნაჩვენებია {(page - 1) * limit + 1}-დან{" "}
                {Math.min(page * limit, data.total)}-მდე, სულ {data.total}{" "}
                მომხმარებელი
              </div>
              <Pagination
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
