"use client";

import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircleIcon,
  LoaderCircle,
  Loader,
  Check,
  InfoIcon,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";
import { useUserStore } from "@/lib/stores/currentUserStore";

export default function EmailVerificationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {set} = useUserStore()
  const queryClient = useQueryClient();

  const [fetchState, setFetchState] = useState<
    "IDLE" | "LOAD" | "SUCCESS" | "ERROR"
  >("IDLE");

  const verifyEmail = async () => {
    setFetchState("LOAD");
    try {
      const response = await fetch(
        `http://localhost:5000/email/${params.id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      const data = await response.json();
      set(data)
      setFetchState("SUCCESS");

      setTimeout(() => {
        router.push("/user/settings");
      }, 1233000);

    } catch (error) {
      setFetchState("ERROR");
      setTimeout(() => {
        router.push("/");
      }, 1233000);
    }
  };

  useEffect(() => {
     setTimeout(() => {
      verifyEmail();
     }, 1000);
  }, []);

  if (fetchState === "IDLE" || fetchState === "LOAD") {
    return (
      <div className=" mx-auto p-6 text-center h-screen flex items-center justify-center flex-col space-y-6">
        <div className="flex items-center justify-center flex-col space-y-4">
          <Loader className="animate-spin w-10 h-10 text-blue-500" />
          <h1 className="text-2xl font-bold">Validando seu e-mail...</h1>
          <p className="text-gray-600">
            Estamos confirmando seus dados. Isso pode levar alguns instantes.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-sm w-full text-center flex items-center justify-center">
          <div className="flex items-start space-x-2">
            <div>
              <p className="mb-2">
                • Não feche esta janela durante a verificação
              </p>
              <p>• Caso demore muito, verifique sua pasta de spam</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Processando sua solicitação...
        </p>
      </div>
    );
  }

  if (fetchState === "ERROR") {
    return (
      <div className=" mx-auto p-6 text-center h-screen flex items-center justify-center flex-col space-y-5 ">
        <div className="mb-6"></div>

        <div className="flex items-center justify-center flex-col">
          <AlertCircleIcon className="text-red-400 w-10 h-10" />
          <h1 className="text-2xl font-bold mt-2">
            Falha na verificação de e-mail
          </h1>
          <p className="text-gray-600 mb-6">
            Ocorreu um problema ao validar seu endereço de e-mail. Por favor,
            tente novamente.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-sm text-center mb-6 w-full  ">
          <p className="mb-2">
            • O link de verificação expirou (válido por 1 hora)
          </p>
          <p className="mb-2">• O link utilizado é inválido ou já foi usado</p>
          <p>• Você pode ter clicado em um link incompleto</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/">Voltar à página inicial</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/user/settings">Enviar verificação novamente</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-6 text-center h-screen  flex items-center justify-center flex-col">
      <div className="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold mb-2">
        Verificação concluída com sucesso!
      </h1>

      <p className="text-gray-600 mb-6">
        Seu cadastro foi <strong>validado com segurança</strong> e sua conta
        está pronta para uso completo.
      </p>

      <div className="bg-gray-50 p-4 rounded-lg text-sm text-center mb-6">
        <p className="mb-2">
          • <strong>Selo de verificação:</strong> Seus posts terão identificação
          de conta autêntica
        </p>
        <p className="mb-2">
          • <strong>Mensagens diretas:</strong> Agora você pode enviar e receber
          mensagens privadas
        </p>
        <p>
          • <strong>Acesso completo:</strong> Todos os recursos do app estão
          liberados para você
        </p>
      </div>

      <Button className="cursor-pointer  " variant={"outline"}>
        Acessar minha conta
      </Button>
    </div>
  );
}
