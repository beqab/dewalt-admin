"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
          <h1 className="text-2xl font-bold sm:text-3xl">Users</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage users and their permissions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="search">Search by email</Label>
          <Input
            id="search"
            placeholder="example@gmail.com"
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
          Failed to load users:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      ) : (
        <>
          <UsersTable users={data?.data || []} />

          {isLoading && (
            <div className="text-sm text-muted-foreground">Loading...</div>
          )}

          {data && data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, data.total)} of {data.total} users
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
