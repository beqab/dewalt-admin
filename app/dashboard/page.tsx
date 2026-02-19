"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Newspaper,
  Image,
  SlidersHorizontal,
  Package,
  Loader2,
} from "lucide-react";
import { dummyUsers } from "@/features/users/data/dummy-users";
import { dummyProducts } from "@/features/products/data/dummy-products";
import { dummyNews } from "@/features/news/data/dummy-news";
import { useGetBannerSlider } from "@/features/bannerSlider";

export default function DashboardPage() {
  const { data: bannerSliderData, isLoading: isBannerSliderLoading } =
    useGetBannerSlider();
  const bannerCount = bannerSliderData?.banners?.length || 0;

  const stats = [
    {
      title: "მომხმარებლები",
      value: dummyUsers.length.toString(),
      description: "რეგისტრირებული მომხმარებლების რაოდენობა",
      icon: Users,
      href: "/dashboard/users",
    },
    {
      title: "პროდუქტები",
      value: dummyProducts.length.toString(),
      description: "პროდუქტების რაოდენობა",
      icon: Package,
      href: "/dashboard/products",
    },
    {
      title: "სიახლეები",
      value: dummyNews.length.toString(),
      description: "სიახლეების რაოდენობა",
      icon: Newspaper,
      href: "/dashboard/news",
    },
    {
      title: "რეკლამები",
      value: 5,
      description: "აქტიური რეკლამები",
      icon: Image,
      href: "/dashboard/ads",
    },
    {
      title: "ბანერ-სლაიდერები",
      value: isBannerSliderLoading ? (
        <Loader2 className="animate-spin w-6 h-6" />
      ) : (
        bannerCount.toString()
      ),
      description: "ბანერების რაოდენობა",
      icon: SlidersHorizontal,
      href: "/dashboard/banner-slider",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">დეშბორდი</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          მოგესალმებით Dewalt-ის ადმინისტრაციულ პანელში
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
