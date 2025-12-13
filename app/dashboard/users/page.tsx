"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { UsersTable } from "@/features/users/components/users-table"
import { UserFormDialog } from "@/features/users/components/user-form-dialog"
import type { User, CreateUserDto, UpdateUserDto } from "@/features/users/types"
import { dummyUsers } from "@/features/users/data/dummy-users"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(dummyUsers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>()

  const handleCreate = () => {
    setEditingUser(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      // TODO: Implement API call
      setUsers(users.filter((u) => u.id !== id))
    }
  }

  const handleSubmit = async (data: CreateUserDto | UpdateUserDto) => {
    // TODO: Implement API call
    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...u, ...data } : u
        )
      )
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...(data as CreateUserDto),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setUsers([...users, newUser])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Users</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Manage users and their permissions</p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <UsersTable
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <UserFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={editingUser}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

