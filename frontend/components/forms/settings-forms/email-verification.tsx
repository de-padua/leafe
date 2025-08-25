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

import url from "@/api";

function EmailVerification({ userData }: { userData: User }) {
  const id = useId();

  const [isLoading, setLoading] = useState(false);

  const sendVerificationEmail = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${url}/email`, {
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
        `EmailVerification:${userData.id}`,
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
    localStorage.getItem(`EmailVerification:${userData.id}`) ||
      JSON.stringify({ status: null, isValidTil: null })
  );

  if (userData.metadata.emailVerified) {
    return (
      <div className="w-full flex items-center justify-center border p-3 rounded-md flex-col gap-2 py-8">
        <p className="text-xs text-gray-600">Email verificado com sucesso.</p>
        <p className="text-xs text-gray-400">
          Seu e-mail está verificado e sua conta está segura.
          <a
            href="/verified-benefits"
            className="text-blue-600 hover:underline ml-1"
          >
            Veja as vantagens de ter um e-mail verificado.
          </a>
        </p>
      </div>
    );
  }

  if (storedData && new Date(storedData.isValidTil) > new Date()) {
    return (
      <div className="w-full flex items-center justify-center border p-3 rounded-md flex-col gap-2 py-8">
        <p className="text-xs text-gray-600">
          Verificação de email foi enviada ao seu email e está pendente
        </p>
        <p className="text-xs text-gray-400 ">
          Será enviado um link ao seu email, clique no link para ser
          redirecionado e concluir a verificação de email.
        </p>
        <div className="flex items-center justify-center">
          <Button variant={"outline"} className="text-xs cursor-pointer"  onClick={sendVerificationEmail}>Não recebeu o link ? Reenviar link de confirmação</Button>
        </div>
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
      <p className="text-xs text-gray-600">
        Será enviado um link ao seu email, clique no link para ser redirecionado
        e concluir a verificação de email.{" "}
        <a
          href="/verified-benefits"
          className="text-blue-600 hover:underline ml-1"
        >
          Veja as vantagens de ter um e-mail verificado.
        </a>
      </p>
    </div>
  );
}

export default EmailVerification;
