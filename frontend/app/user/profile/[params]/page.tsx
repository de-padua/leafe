"use client";
dotenv.config();
import * as dotenv from "dotenv";

import ProfileCard from "@/components/custom/profile-card";
import { UserWithoutProperties } from "@/types";

import { useParams } from "next/navigation";
import React from "react";
import UserPosts from "@/components/custom/filtro-pesquisa";
import { useQuery } from "@tanstack/react-query";
import ProfileCardSkeleton from "@/components/custom/profile-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import NotFoundCustom from "@/components/custom/NotFound";
import { useSearchParams } from "next/navigation";
function Page() {
  const filter = "desc";
  const offset = 10;
  const limit = 10; 

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const getPublicUserData = async (): Promise<UserWithoutProperties | null> => {
    console.log(userId);
    try {
      const response = await fetch(
        `http://localhost:5000/users/public/?userId=${userId}&sort=${filter}&offset=${offset}&limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      console.log(data);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["publicUserData"],
    queryFn: async () => {
      return getPublicUserData();
    },
  });

  if (isLoading) return <div></div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!data) return <div>xxx</div>;

  return <div className=" flex items-center justify-center flex-col">xxx</div>;
}

export default Page;
