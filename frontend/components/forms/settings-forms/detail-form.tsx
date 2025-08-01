"use client";
import { User } from "@/types";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { map, object, z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserStore } from "@/lib/stores/currentUserStore";
import {
  Activity,
  AlertCircleIcon,
  AlertTriangleIcon,
  AtSignIcon,
  BellIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleAlertIcon,
  CirclePower,
  CirclePowerIcon,
  Clipboard,
  CommandIcon,
  Download,
  EclipseIcon,
  EyeIcon,
  EyeOffIcon,
  Fingerprint,
  IdCard,
  InfoIcon,
  LifeBuoyIcon,
  Link2Icon,
  Loader2,
  LucideShieldUser,
  Mail,
  Plus,
  PlusIcon,
  Shield,
  ShieldAlert,
  ShieldCheckIcon,
  Trash,
  Trash2Icon,
  User2,
  XCircleIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MenubarRadioGroup } from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import OTP from "./otp-codigos";
import { CloseIcon } from "@/components/tiptap-icons/close-icon";
import { Badge } from "@/components/ui/badge";
import FullPageLoad from "@/components/custom/full-page-load";
import { useRouter } from "next/navigation";


function DetailFormProfile({ userData }: { userData: User}) {

  const queryClient = useQueryClient();

  const { set } = useUserStore();

  const route = useRouter();

  const [timer, setTimer] = useState(0);
  const [isActivated, setActivatedTimer] = useState(false);
  const [load, setLoading] = useState(false);


  const profileSchema = z.object({
    password: z.string(),
  });

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit() {
    form.clearErrors();

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/users`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: form.getValues().password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw data;

      queryClient.setQueryData(["userData"], null);

      route.push("/user/deleted");
    } catch (err:any) {
      if (err.statusCode === 401) {
        setLoading(false);

        form.setError("password", {
          message: "Senha invalida, tente novamente.",
        });
      }
    }
  }

  function formatKeyName(key: string): string {
    const names: Record<string, string> = {
      emailVerified: "Verificação de e-mail",
      twoFactorEnabled: "Autenticação em 2 etapas",
      registrationIp: "IP de registro",
      registrationDevice: "Dispositivo de registro",
      lastLogin: "Último acesso",
      lastLoginIp: "IP do último acesso",
      loginCount: "Total de logins",
      failedLoginAttempts: "Tentativas falhas",
      profileVersion: "Versão do perfil",
      createdAt: "Conta criada Em",
      updatedAt: "Última atualização",
      accountLockedUntil: "Conta bloqueada até",
    };

    return names[key] || key;
  }

  function formatValue(key: string, value: any): React.ReactNode {
    if (value === null || value === undefined) return "Não disponível";

    switch (key) {
      case "emailVerified":
      case "twoFactorEnabled":
        return (
          <Badge
            className={
              value
                ? "bg-green-600/10 dark:bg-green-600/20 hover:bg-green-600/10 text-green-500 border-green-600/60 shadow-none rounded-full"
                : "bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none rounded-full"
            }
          >
            {" "}
            {value ? "Ativado" : "Desativado"}
          </Badge>
        );

      case "createdAt":
      case "updatedAt":
      case "lastLogin":
      case "accountLockedUntil":
        return new Date(value).toLocaleString("pt-BR");

      case "loginCount":
      case "failedLoginAttempts":
      case "profileVersion":
        return value.toString();

      default:
        return value.toString();
    }
  }

  useEffect(() => {
    if (isActivated) {
      const x = setInterval(() => {
        setTimer((oldValue) => {
          if (oldValue <= 1) {
            clearInterval(x);
            return 0;
          }
          return oldValue - 1;
        });
      }, 1000);
    }
  }, [isActivated]);

  const sub_menu = [
    {
      id: "3",
      icon: <Activity />,
      title: "Status da conta",
      subicon: "",
      content: (
        <div className=" space-y-4 p-4 bg-white rounded-lg border border-gray-200">
          {/* Status de Verificação */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 " />
              <span>Verificação de e-mail</span>
            </div>
            {userData.metadata.emailVerified ? (
              <Badge className="bg-blue-600/10 dark:bg-blue-600/20 hover:bg-blue-600/10 text-blue-500 shadow-none rounded-full">
                {" "}
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1" />
                Verificado
              </Badge>
            ) : (
              <Badge className="bg-gray-600/10 dark:bg-gray-600/20 hover:bg-gray-600/10 text-gray-500 shadow-none rounded-full">
                {" "}
                <div className="h-1.5 w-1.5 rounded-full bg-gray-500 mr-1" />
                Pendente
              </Badge>
            )}
          </div>

          {/* Selo de Verificação */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 " />
              <span>Selo de verificação</span>
            </div>

            {userData.metadata.emailVerified ? (
              <Badge className="bg-blue-600/10 dark:bg-blue-600/20 hover:bg-blue-600/10 text-blue-500 shadow-none rounded-full">
                {" "}
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1" />
                Ativo
              </Badge>
            ) : (
              <Badge className="bg-gray-600/10 dark:bg-gray-600/20 hover:bg-gray-600/10 text-gray-500 shadow-none rounded-full">
                {" "}
                <div className="h-1.5 w-1.5 rounded-full bg-gray-500 mr-1" />
                Pendente
              </Badge>
            )}
          </div>

          {/* Status da Conta */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center gap-2">
              <User2 className="h-4 w-4 " />
              <span>Status</span>
            </div>
            <Badge className="bg-blue-600/10 dark:bg-blue-600/20 hover:bg-blue-600/10 text-blue-500 shadow-none rounded-full">
              {" "}
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1" />
              Ativa
            </Badge>
          </div>
        </div>
      ),
    },
    {
      id: "11",
      icon: <CirclePowerIcon />,
      title: " Exclusão de conta",
      subicon: "",

      content: (
        <div className=" p-4 py-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-col">
          <div className="text-center ">
            <AlertTriangleIcon className="mx-auto h-8 w-8  mb-3" />
            <h2 className="text-lg font-semibold mb-2">
              Exclusão de Conta Permanente
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Antes de prosseguir, por favor leia atentamente:
            </p>

            <div className="my-5 ">
              <ul className="space-y-2  text-center list-disc text-sm text-gray-700">
              <li className="[&::marker]:text-gray-500/0">
                <strong>Dados permanentes:</strong> Todos os seus dados serão
                apagados imediatamente
              </li>
              <li className="[&::marker]:text-gray-500/0">
                <strong>Conteúdo público:</strong> Pode permanecer visível em
                serviços integrados
              </li>
              <li className="[&::marker]:text-gray-500/0">
                <strong>Assinaturas:</strong> Cancelamento imediato sem
                reembolso
              </li>
            </ul>
            </div>

            <p className="text-xs text-gray-500 mb-6">
              Ao deletar sua conta, você concorda com nossos{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Política de Privacidade
              </a>
              .
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className=""
                onClick={() => {
                  setActivatedTimer(true);
                }}
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Prosseguir com a exclusão
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <div className="flex flex-col items-center gap-4  text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangleIcon className="h-6 w-6 text-red-600" />
                </div>

                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    Tem certeza que deseja deletar sua conta?
                  </DialogTitle>
                  <DialogDescription className="text-sm text-center text-muted-foreground">
                    Esta ação é permanente e não pode ser desfeita.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className=""
                        type="password"
                      />
                    </FormControl>
                    <FormDescription>
                      Digite sua senha para confirmar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                onClick={() => {
                  onSubmit();
                }}
                disabled={timer <= 0 ? false : true}
                variant="destructive"
                className="cursor-pointer"
                type="submit"
              >
                {load ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    ({timer}) Confirmar
                    <Trash />
                  </>
                )}
              </Button>
              <DialogFooter className="flex items-center justify-between">
                <DialogClose asChild className="">
                  <Button variant="outline" className=" w-full" type="button">
                    Cancelar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
  ];

  const items = [
    {
      id: "3",
      icon: ShieldCheckIcon,
      title: "Informações e dados",
      sub: "Gerencie suas informações pessoais.",

      content: (
        <div>
          <Separator className="my-2" />
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="0"
          >
            {sub_menu.map((item) => (
              <AccordionItem value={item.id} key={item.id} className="py-2">
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                    <span className="flex items-center gap-3">
                      {item.icon}
                      <p className="text-sm">{item.title}</p>
                      {item.subicon}
                    </span>
                    <PlusIcon
                      size={16}
                      className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                      aria-hidden="true"
                    />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="">{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full p-10">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Detalhes da sua conta</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie suas informações pessoais e preferências.
        </p>
      </div>
      <div>
        <div className="space-y-4">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="0"
          >
            {items.map((item) => (
              <AccordionItem value={item.id} key={item.id} className="py-2 bg">
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&[data-state=open]>svg]:rotate-180">
                    <span className="flex items-center gap-3">
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                      >
                        <item.icon size={16} className="opacity-60" />
                      </span>
                      <span className="flex flex-col space-y-1">
                        <span>{item.title}</span>
                        {item.sub && (
                          <span className="text-sm font-normal">
                            {item.sub}
                          </span>
                        )}
                      </span>
                    </span>
                    <ChevronDownIcon
                      size={16}
                      className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                      aria-hidden="true"
                    />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="text-muted-foreground ms-3 ps-10 pb-2 ">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      {item.content}
                    </form>
                  </Form>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default DetailFormProfile;
