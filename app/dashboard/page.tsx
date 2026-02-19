"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Newspaper,
  Image,
  SlidersHorizontal,
  Package,
  Loader2,
} from "lucide-react";
import { useGetBannerSlider } from "@/features/bannerSlider";
import { useGetUsers } from "@/features/users";
import { useGetProducts } from "@/features/products";
import { useGetNews } from "@/features/news";
import { useGetAds } from "@/features/ads";

export default function DashboardPage() {
  const { data: usersData, isLoading: isUsersLoading } = useGetUsers({
    page: 1,
    limit: 20,
  });
  const { data: productsData, isLoading: isProductsLoading } = useGetProducts({
    page: 1,
    limit: 20,
  });
  const { data: newsData, isLoading: isNewsLoading } = useGetNews(1, 20);
  const { data: adsData, isLoading: isAdsLoading } = useGetAds();
  const { data: bannerSliderData, isLoading: isBannerSliderLoading } =
    useGetBannerSlider();

  const usersCount = usersData?.total || 0;
  const productsCount = productsData?.total || 0;
  const newsCount = newsData?.total || 0;
  const adsCount = adsData?.length || 0;
  const bannerCount = bannerSliderData?.banners?.length || 0;

  const stats = [
    {
      title: "მომხმარებლები",
      value: isUsersLoading ? (
        <Loader2 className="animate-spin w-6 h-6" />
      ) : (
        usersCount.toString()
      ),
      description: "რეგისტრირებული მომხმარებლების რაოდენობა",
      icon: Users,
      href: "/dashboard/users",
    },
    {
      title: "პროდუქტები",
      value: isProductsLoading ? (
        <Loader2 className="animate-spin w-6 h-6" />
      ) : (
        productsCount.toString()
      ),
      description: "პროდუქტების რაოდენობა",
      icon: Package,
      href: "/dashboard/products",
    },
    {
      title: "სიახლეები",
      value: isNewsLoading ? (
        <Loader2 className="animate-spin w-6 h-6" />
      ) : (
        newsCount.toString()
      ),
      description: "სიახლეების რაოდენობა",
      icon: Newspaper,
      href: "/dashboard/news",
    },
    {
      title: "რეკლამები",
      value: isAdsLoading ? (
        <Loader2 className="animate-spin w-6 h-6" />
      ) : (
        adsCount.toString()
      ),
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
