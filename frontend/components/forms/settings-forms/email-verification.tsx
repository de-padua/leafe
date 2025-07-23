"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { Label } from "@/components/ui/label";
import { OTPInput, SlotProps } from "input-otp";
import { Loader2, Mail, MinusIcon, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function EmailVerification({ userData }: { userData: User }) {
  const id = useId();

  const [isLoading, setLoading] = useState(false);
  const sendVerificationEmail = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/email-verification", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw response;
      const data = await response.json();

      toast.success("Verificação de email enviada ao seu email.");
      localStorage.setItem(
        "EmailVerification",
        JSON.stringify({
          status: true,
          isValidTil: new Date(new Date().getTime() + 3 * 60 * 60 * 1000), // 3h
        })
      ); 
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const storedData = JSON.parse(
    localStorage.getItem("EmailVerification") ||
      JSON.stringify({ status: null, isValidTil: null })
  );

  if (userData.metadata[0].emailVerified) {
    return (
      <div className="w-full flex items-center justify-center border p-3 rounded-md flex-col gap-2 py-8">
        <p className="text-xs text-green-500">Email verificado com sucesso.</p>
        <p className="text-xs ">
          Seu email está verificado e sua conta está segura.
        </p>
      </div>
    );
  }

  if (storedData && new Date(storedData.isValidTil) > new Date()) {
    return (
      <div className="w-full flex items-center justify-center border p-3 rounded-md flex-col gap-2 py-8">
        <p className="text-xs text-amber-500">
          Verificação de email foi enviada ao seu email e está pendente
        </p>
        <p className="text-xs ">
          Será enviado um link ao seu email, clique no link para ser
          redirecionado e concluir a verificação de email.
        </p>
      </div>
    );
  }
  return (
    <div className="w-full flex items-center justify-center border p-3 rounded-md flex-col gap-2 py-8">
      {isLoading ? (
        <Button className="my-2" size={"sm"} variant={"outline"} disabled>
          <Loader2 className="animate-spin" />
        </Button>
      ) : (
        <Button
          className="my-2"
          size={"sm"}
          variant={"outline"}
          onClick={sendVerificationEmail}
        >
          Enviar verificação ao meu email <Mail />
        </Button>
      )}
      <p className="text-xs">
        Será enviado um link ao seu email, clique no link para ser redirecionado
        e concluir a verificação de email.
      </p>
    </div>
  );
}

export default EmailVerification;
