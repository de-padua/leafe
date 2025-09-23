"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ur } from "zod/v4/locales"
import { useRouter } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: any
  }[]
}) {

  const route = useRouter()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Anúncios
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
   
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title} onClick={()=>{
              route.push(item.url)
            }}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
