"use client";

import * as React from "react";
import {
  IconActivity,
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconEngineFilled,
  IconExclamationCircle,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "./custom/logo";
import { GearIcon } from "@radix-ui/react-icons";
import { Menu, Shield, UserIcon } from "lucide-react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/user/dashboard/imoveis/list/q?page=1",
      icon: IconActivity,
    },
    {
      title: "Análise e métricas",
      url: "/user/dashboard/metrics/t?page=1",
      icon: IconChartBar,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Segurança",
      url: "#",
      icon: IconExclamationCircle,
    },
    {
      title: "Ajuda ",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Pesquisar",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Perfil",
      url: "/user/settings/profile",
      icon: UserIcon,
    },
    {
      name: "Segurança",
      url: "/user/settings/security",
      icon: Shield,
    },
    {
      name: "Detalhes da conta",
      url: "/user/settings/detail",
      icon: Menu,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        

        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
    </Sidebar>
  );
}
