"use client";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Logo from "../custom/logo";
import { Loader2, Plus, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import UserMenu from "../navbar-components/user-menu";

import LoginForm from "../forms/login";
import NotificationMenu from "../navbar-components/notification-menu";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useId } from "react";
import { useUserStore } from "@/lib/stores/currentUserStore";
import Link from "next/link";

const navigationLinks = [
  { href: "/home", label: "Home", active: true },
  { href: "/home", label: "Anúncios", active: true },
];

export default function CustomNavBar() {
  const userData = useUserStore((state) => state.currentUser);



  if (userData === null)
    return (
      <header className="border-b px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverContent align="start" className="w-36 p-1 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink
                          href={link.href}
                          className="py-1.5"
                          active={link.active}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-6">
              <Logo />

              <NavigationMenu className="max-md:hidden">
                <NavigationMenuList className="gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuLink
                        active={link.active}
                        href={link.href}
                        className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="flex items-center justify-between  rounded-md border py-1  px-3 gap-x-4">
            <div className="space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Entrar</Button>
                </DialogTrigger>

                <DialogContent>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="flex size-31 shrink-0 items-center justify-center rounded-full border"
                      aria-hidden="true"
                    >
                      <Logo />
                    </div>

                    <DialogHeader>
                      <DialogTitle className="sm:text-center">
                        Bem vindo de volta
                      </DialogTitle>

                      <DialogDescription className="sm:text-center">
                        Use suas credenciais para acessar sua conta.
                      </DialogDescription>
                    </DialogHeader>
                  </div>

                  <LoginForm />
                </DialogContent>
              </Dialog>

              <Button asChild size={"sm"} className="" variant={"default"}>
                <a href="/singup"> Criar conta</a>
              </Button>
            </div>
          </div>
        </div>
      </header>
    );

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink
                        href={link.href}
                        className="py-1.5"
                        active={link.active}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-6">
            <Logo />
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      active={link.active}
                      href={link.href}
                      className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="flex items-center justify-between  rounded-md border py-1  px-3 gap-x-4">
          <Link href={"/anuncio/novo"}>
          <Button>Novo anúncio <Plus /> </Button>
          </Link>
          <NotificationMenu />
          <UserMenu userdata={userData} />
        </div>
      </div>
    </header>
  );
}
