import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, ShieldAlert, Verified } from "lucide-react";

function RecoveryEmail({ userData }: { userData: User }) {

  const recoveryEmailSchema = z.object({
    recoveryEmail: z.string().email(),
  });

  const form = useForm<z.infer<typeof recoveryEmailSchema>>({
    resolver: zodResolver(recoveryEmailSchema),
    defaultValues: {
      recoveryEmail: userData.recoveryEmail ? userData.recoveryEmail : "",
    },
  });
  const queryClient = useQueryClient();

  async function onSubmit(values: z.infer<typeof recoveryEmailSchema>) {
    const response = await fetch(`http://localhost:5000/email/recovery-email`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.recoveryEmail,
      }),
    });
    const data = await response.json();
    queryClient.setQueryData(["userData"], data);

    return data;
  }

  return (
    <div className="p-4  bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-col">
      {userData.lastUpdateOnRecoveryEmail ? (
        <>
          <div className="my-5 text-center">
        
            <p className="flex items-center gap-2  text-xs text-gray-600">
              Você poderá alterar o e-mail de recuperação novamente após:{" "}
              <span className=" font-semibold text-gray-500">
                {new Date(
                  userData.lastUpdateOnRecoveryEmail
                ).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Esta restrição ajuda a proteger sua conta contra alterações não
              autorizadas.
            </p>
          </div>
        </>
      ) : (
        <div className="w-full flex items-center justify-center ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-2">
                <div className="space-y-2 ">
                 <div>
                  

                  <p className="text-xs text-gray-600">
                    E-mail alternativo para receber códigos de
                    recuperação caso você perca o acesso à sua conta principal.
                  </p>
                 </div>

                  <p className="text-xs text-gray-400">
                    Importante: Este e-mail será usado apenas para segurança da
                    conta e não para comunicações.
                  </p>
                </div>
                <div className="flex items-center justify-center w-full gap-x-2">
                  <FormField
                  control={form.control}
                  name="recoveryEmail"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          className="w-full"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="">
                  <Button disabled={!form.formState.isDirty} className="">
                    Salvar
                  </Button>
                </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}

export default RecoveryEmail;
