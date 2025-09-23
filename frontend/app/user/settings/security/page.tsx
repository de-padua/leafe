"use client";
import Logo from "@/components/custom/logo";
import ProfileForm from "@/components/forms/settings-forms/profile-form";
import SecurityForm from "@/components/forms/settings-forms/security-form";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/stores/currentUserStore";
import React from "react";

function page() {
  const { isLoadingError, isLoading, currentUser } = useUserStore();

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center  justify-center "></div>
    );
  if (isLoadingError?.message === "Too many requests")
    return (
      <div className="w-full  flex items-center  justify-center flex-col gap-y-5">
        <h1 className="text-5xl">⚠️ Muitas Solicitações </h1>
        <p>
          Você fez muitas requisições em um curto período. Por favor, aguarde
          alguns instantes e tente novamente.
        </p>
        <Button>voltar para home</Button>
      </div>
    );

  if (currentUser === null)
    return (
      <div className="w-full h-screen flex items-center  justify-center "></div>
    );
  return (
    <div>
      <SecurityForm userData={currentUser} />
    </div>
  );
}

export default page;
