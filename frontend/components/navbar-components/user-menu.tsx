"use client";
import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  LogOutIcon,
  PanelsTopLeft,
  PinIcon,
  Plus,
  PlusCircle,
  User2,
  UserPenIcon,
  Wrench,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExitIcon } from "@radix-ui/react-icons";
import { useUserStore } from "@/lib/stores/currentUserStore";
import { data } from "../custom/estate-filter";

export default function UserMenu(props: { userdata: User }) {
  const queryClient = useQueryClient();

  const { setNull } = useUserStore();

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Logout failed");
      return;
    } catch (err) {
      console.error(err);
    }
  };

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      console.log("logout successful:", data);
      queryClient.invalidateQueries();
      queryClient.clear();
    },
    onError: (error) => {
      console.error("logout error:", error);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage
              className="object-cover"
              src={props.userdata.profilePictureUrl}
              alt="Profile image"
            />
            <AvatarFallback>
              {props.userdata.firstName[0].toUpperCase()}
              {props.userdata.lastName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <div className="text-foreground truncate text-sm font-medium gap-x-1 flex w-full ">
            <span>{props.userdata.firstName}</span>
            <span>{props.userdata.lastName}</span>
          </div>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {props.userdata.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <a href={`/public/profile/v1?userId=${props.userdata.id}`}>
            <DropdownMenuItem>
              <User2 size={16} className="opacity-60" aria-hidden="true" />
              <span> Meu perfil</span>
            </DropdownMenuItem>{" "}
          </a>
          <a href={`/user/settings/profile`}>
            <DropdownMenuItem>
              <Wrench size={16} className="opacity-60" aria-hidden="true" />
              <span> Configurações de conta</span>
            </DropdownMenuItem>{" "}
          </a>
          <DropdownMenuSeparator />
          <a href={`/user/dashboard/imoveis/list/data?page=1`}>
            <DropdownMenuItem>
              <PanelsTopLeft
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span> Dashboard</span>
            </DropdownMenuItem>{" "}
          </a>

          <a href={`/anuncio/novo`}>
            <DropdownMenuItem>
              <PlusCircle size={16} className="opacity-60" aria-hidden="true" />
              <span> Novo anúncio</span>
            </DropdownMenuItem>
          </a>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => mutation.mutate()}>
            <ExitIcon className="opacity-60" aria-hidden="true" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
