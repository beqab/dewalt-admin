"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { AdsTable } from "@/features/ads/components/ads-table";
import {
  useGetAds,
  useDeleteAd,
  useCreateAd,
  useUpdateAd,
} from "@/features/ads";
import type { Ad, CreateAdDto, UpdateAdDto } from "@/features/ads/types";
import { AdPosition } from "@/features/ads/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UploadImage from "@/components/uploadImage";
import { toast } from "sonner";

const positionLabels: Record<AdPosition, string> = {
  main_page: "Main Page",
  aside: "Aside",
  footer: "Footer",
};

export default function AdsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | undefined>();

  const { data: ads, isLoading, error } = useGetAds();
  const createAd = useCreateAd();
  const updateAd = useUpdateAd();
  const deleteAd = useDeleteAd();

  const [formData, setFormData] = useState({
    imageUrl: "",
    urlLink: "",
    position: "" as AdPosition | "",
  });

  const handleCreate = () => {
    setEditingAd(undefined);
    setFormData({
      imageUrl: "",
      urlLink: "",
      position: "" as AdPosition | "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad);
    setFormData({
      imageUrl: ad.imageUrl,
      urlLink: ad.urlLink || "",
      position: ad.position,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this ad?")) {
      deleteAd.mutate(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error("Please upload an image");
      return;
    }
    if (!formData.position) {
      toast.error("Please select a position");
      return;
    }

    if (editingAd) {
      updateAd.mutate(
        { id: editingAd._id, data: formData as UpdateAdDto },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
        }
      );
    } else {
      createAd.mutate(formData as CreateAdDto, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          Error loading ads:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" /> Loading...
      </div>
    );
  }

  // Get available positions (positions not already used)
  const usedPositions = ads?.map((ad) => ad.position) || [];
  const availablePositions = Object.values(AdPosition).filter(
    (pos) => !usedPositions.includes(pos) || editingAd?.position === pos
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Ads</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage advertisements
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Ad
        </Button>
      </div>

      <AdsTable ads={ads || []} onEdit={handleEdit} onDelete={handleDelete} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingAd ? "Edit Ad" : "Create Ad"}</DialogTitle>
              <DialogDescription>
                {editingAd
                  ? "Update ad information."
                  : "Add a new advertisement."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) =>
                    setFormData({ ...formData, position: value as AdPosition })
                  }
                  required
                  disabled={!!editingAd}
                >
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePositions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {positionLabels[position]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editingAd && (
                  <p className="text-xs text-muted-foreground">
                    Position cannot be changed after creation
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <UploadImage
                  onImageChange={(url) =>
                    setFormData({ ...formData, imageUrl: url })
                  }
                  imageUrl={formData.imageUrl}
                  defaultImageUrl={editingAd?.imageUrl}
                  label="Image"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="urlLink">Link URL (Optional)</Label>
                <Input
                  id="urlLink"
                  type="url"
                  value={formData.urlLink}
                  onChange={(e) =>
                    setFormData({ ...formData, urlLink: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createAd.isPending || updateAd.isPending}
              >
                {createAd.isPending || updateAd.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingAd ? "Updating..." : "Creating..."}
                  </>
                ) : editingAd ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
