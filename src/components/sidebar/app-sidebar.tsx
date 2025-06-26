import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconHome,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
} from "@tabler/icons-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/AuthContext"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: 'admin' | 'user';
}

export function AppSidebar({ userRole, ...props }: AppSidebarProps) {
  const { user } = useAuth()

  // Navigation items berdasarkan role
  const getNavItems = () => {
    if (userRole === 'admin') {
      return [
        {
          title: "Dashboard",
          url: "/admin",
          icon: IconDashboard,
        },
        {
          title: "Catering Menu",
          url: "/admin/menu",
          icon: IconListDetails,
        },
        {
          title: "Orders",
          url: "/admin/orders",
          icon: IconChartBar,
        },
        {
          title: "Users",
          url: "/admin/users",
          icon: IconFolder,
        },
      ]
    } else {
      return [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: IconDashboard,
        },
      ]
    }
  }

  // User data dari auth context
  const userData = {
    name: user?.user_metadata?.full_name || user?.email || "User",
    email: user?.email || "user@example.com",
    avatar: user?.user_metadata?.avatar_url || "/avatars/default.jpg",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Sea Catering</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getNavItems()} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}