"use client";

import {
  Card,
  CardContent,
  CardDescription,
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
      title: "Users",
      value: dummyUsers.length.toString(),
      description: "Total registered users",
      icon: Users,
      href: "/dashboard/users",
    },
    {
      title: "Products",
      value: dummyProducts.length.toString(),
      description: "Total products",
      icon: Package,
      href: "/dashboard/products",
    },
    {
      title: "News",
      value: dummyNews.length.toString(),
      description: "Total news articles",
      icon: Newspaper,
      href: "/dashboard/news",
    },
    {
      title: "Ads",
      value: 5,
      description: "Active ads",
      icon: Image,
      href: "/dashboard/ads",
    },
    {
      title: "Banner Sliders",
      value: isBannerSliderLoading ? (
        <Loader2 className="animate-spin w-6 h-6" />
      ) : (
        bannerCount.toString()
      ),
      description: "Total banners",
      icon: SlidersHorizontal,
      href: "/dashboard/banner-slider",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Welcome to Dewalt Admin Panel
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
