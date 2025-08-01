"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter, DialogHeader } from "@/components/ui/dialog";
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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangleIcon,
  ClockIcon,
  Copy,
  DownloadIcon,
  EyeClosedIcon,
  EyeIcon,
  HashIcon,
  Key,
  KeyIcon,
  Loader,
  Shield,
  ShieldAlert,
  ShieldCheckIcon,
  Trash,
} from "lucide-react";
import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

type userCodes = {
  id: string;
  code: string;
  userId: string;
  createdAt: Date;
};
function RecoveryCodes({ userData }: { userData: User }) {
  const formSchema = z.object({
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const [userCodes, setCodes] = useState<userCodes[] | null>([
    {
      id: "12312313",
      code: "12312313",
      userId: "12312313",
      createdAt: new Date(),
    },
    {
      id: "12312313",
      code: "12312313",
      userId: "12312313",
      createdAt: new Date(),
    },
    {
      id: "12312313",
      code: "12312313",
      userId: "12312313",
      createdAt: new Date(),
    },
    {
      id: "12312313",
      code: "12312313",
      userId: "12312313",
      createdAt: new Date(),
    },
    {
      id: "12312313",
      code: "12312313",
      userId: "12312313",
      createdAt: new Date(),
    },
    {
      id: "12312313",
      code: "12312313",
      userId: "12312313",
      createdAt: new Date(),
    },
    {
      id: "12312313",
      code: "12312313",
      userId: "12312313",
      createdAt: new Date(),
    },
    {
      id: "12312313",
      code: "12312313",
      userId: "12312313",
      createdAt: new Date(),
    },
    {
      id: "12312313",
      code: "12312313",
      userId: "12312313",
      createdAt: new Date(),
    },
    {
      id: "12312313",
      code: "12312313",
      userId: "12312313",
      createdAt: new Date(),
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const [viewCodes, setViewCodes] = useState(false);
  const queryClient = useQueryClient();

  async function generateCodes(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response = await fetch(
      `http://localhost:5000/users/recovery-codes/generates`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: values.password,
        }),
      }
    );

    const data = await response.json();
    queryClient.setQueryData(["userData"], data);

    if (!response.ok) {
      setIsSuccess(false);
    }

    setOpenModal(false);
    setIsSuccess(true);
  }

  async function getCodes(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response = await fetch(
      `http://localhost:5000/users/recovery-codes/access`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: values.password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setIsSuccess(false);
    }

    setCodes(data);

    setOpenModal(false);
    setIsSuccess(true);
    setLoading(false);
  }

  const codesLength = 10;
  const numberOfDigitsOnACode = 4;

  let codes: string[] = [];

  for (let index = 0; index < codesLength; index++) {
    let newCode = "";

    for (let index = 0; index < numberOfDigitsOnACode; index++) {
      const n = Math.round(Math.random() * 8 + 1);
      newCode = newCode + n;
    }
    codes.push(newCode);
  }

  const handleViewCodes = () => {
    setViewCodes((oldValue) => !oldValue);
  };

  return (
    <>
      {userData.isRecoveryCodesGenerated ? (
        <div className="p-4 py-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-col gap-y-2">
          <p className="text-xs text-gray-600 text-center max-w-md">
            Meus códigos de recuperação
          </p>
          <p className="text-xs text-gray-400  text-center max-w-md">
            Guarde estes códigos em um local seguro. Eles serão necessários se
            você perder o acesso à sua conta.
          </p>
         
          <div className="flex items-center justify-center ">
            
            {viewCodes ? (
              ""
            ) : (
              <Button
                className="absolute"
                size={"icon"}
                onClick={handleViewCodes}
              >
                <EyeIcon />
              </Button>
            )}
            <div className="grid-cols-5 grid  gap-4 mb-5    ">
              {userCodes &&
                userCodes.map((i: userCodes, index) => {
                  return (
                    <p className={viewCodes ? "" : " blur-[3px]"} key={index}>
                      {i.code}
                    </p>
                  );
                })}
            </div>
          </div>

          <div className="flex items-center justify-center flex-col">
            {userCodes ? (
              <div className="flex items-center justify-center gapx2">
                <Button variant={'outline'} size={'sm'}>
                <Copy />
               </Button>
                <Button size={"sm"} variant={"outline"}>
                  Gerar códigos novos <Key />
                </Button>
                <Button size={"sm"} variant={"destructive"}>
                  Deletar códigos <Trash />
                </Button>
                 
              </div>
            ) : (
              <Dialog open={openModal}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className=" my-2 w-full"
                    size={"sm"}
                    onClick={() => {
                      setOpenModal(true);
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <>
                        <Key className="h-4 w-4" />
                        Gerenciar códigos
                      </>
                    )}
                  </Button>
                  
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <div className="flex flex-col items-center gap-4  text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full  border">
                      <ShieldAlert className="h-6 w-6 text-gray-600" />
                    </div>
                    <DialogHeader className="text-center space-y-1">
                      <DialogTitle className="text-lg font-semibold">
                        <div className="flex items-center justify-center gap-2">
                          <span>Verificação de Segurança</span>
                        </div>
                      </DialogTitle>
                      <DialogDescription className="text-sm px-4 text-center">
                        Para gerenciar seus códigos de recuperação, confirme sua
                        identidade.
                      </DialogDescription>
                    </DialogHeader>
                  </div>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(getCodes)}
                      className="space-y-8"
                    >
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                type="password"
                                disabled={loading}
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter className="flex items-center justify-between">
                        <Button type="submit">
                          {loading ? (
                            <Loader className="animate-spin" />
                          ) : (
                            <>
                              <KeyIcon className="h-4 w-4 text-xs" />
                              Gerenciar códigos
                            </>
                          )}
                        </Button>
                        <DialogClose asChild className="">
                          <Button
                            variant="outline"
                            className=" w-full"
                            type="button"
                          >
                            Cancelar
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      ) : (
        <div className=" p-4 py-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-col gap-y-2 ">
          <p className=" text-xs text-gray-600">
            Estes códigos substituirão quaisquer códigos anteriores.
          </p>
          <p className="text-xs text-gray-400 ">
            Salve esta página ou imprima os códigos. Você precisará deles para
            recuperar o acesso à conta.
          </p>
          <div className=" rounded-lg text-left">
            <Dialog open={openModal}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className=" my-2 w-full"
                  size={"sm"}
                  onClick={() => {
                    setOpenModal(true);
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <>
                      <KeyIcon className="h-4 w-4 text-xs" />
                      Gerar novos códigos
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <div className="flex flex-col items-center gap-4  text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full  border">
                    <ShieldAlert className="h-6 w-6 text-gray-600" />
                  </div>
                  <DialogHeader className="text-center space-y-1">
                    <DialogTitle className="text-lg font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <span>Verificação de Segurança</span>
                      </div>
                    </DialogTitle>
                    <DialogDescription className="text-sm px-4 text-center">
                      Para gerar seus códigos de recuperação, confirme sua
                      identidade.
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(generateCodes)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              type="password"
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter className="flex items-center justify-between">
                      <Button type="submit">
                        {loading ? (
                          <Loader className="animate-spin" />
                        ) : (
                          <>
                            <KeyIcon className="h-4 w-4 text-xs" />
                            Gerar novos códigos
                          </>
                        )}
                      </Button>
                      <DialogClose asChild className="">
                        <Button
                          variant="outline"
                          className=" w-full"
                          type="button"
                        >
                          Cancelar
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </>
  );
}

export default RecoveryCodes;
