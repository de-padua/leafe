"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserWithoutProperties } from "@/types";
import { BadgeCheck, Calendar, Calendar1, MailIcon, Phone, PhoneForwardedIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import React from "react";
import { z } from "zod";
import { Textarea } from "../textarea";
import { Separator } from "../separator";
function MiniProfile({ data }: { data: UserWithoutProperties }) {
  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: "Nome precisa ser pelo menos 2 digitos" })
      .max(50, { message: "Nome precisa ser no máximo 50 digitos" }),
    email: z.string().email({ message: "Email inválido" }),
    description: z
      .string()
      .min(10, { message: "Mensagem precisa ser pelo menos 10 digitos " })
      .max(550, { message: "Mensagem precisa ser pelo até 550 digitos " }),
    phone: z
      .string()
      .regex(/^\d{10,11}$/, "Número de telefone inválido")
      .optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", description: "" },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className=" rounded-md  border  p-6">

      <div className="flex items-start justify-start gap-x-5 h-[100px]">
        <div>
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://github.com/de-padua.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className=" flex items-start flex-col">
          <div>
            <div className="flex items-center justify-start gap-x-1 m-0 font-semibold">
              <p>{data.firstName}</p> <p>{data.lastName}</p>
              <BadgeCheck width={20} height={20} className="text-blue-700" />
            </div>
             <div className="text-sm">
            <p>{data.bio}</p>
          </div>
            <div className="text-xs text-muted-foreground flex items-center justify-start gap-x-1">
              <p> Entrou em</p>
              <p>
                {new Date(data.createdAt).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <Calendar scale={5} width={15} height={15} />
            </div>
          </div>
         
        </div>
      </div>
      <div className="my-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Seu email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Seu telefone (opcional)" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription> <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Sua Mensagem" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription> <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Enviar mensagem <MailIcon />
            </Button>
          </form>
        </Form>
         <div className="flex items-center justify-center w-auto  my-2">
           <p className="text-sm">Ou </p> 
         </div>
        <Button variant={"outline"} type="button" className="w-full"> Whatsapp <PhoneForwardedIcon /></Button>
      </div>
    </div>
  );
}
export default MiniProfile;
