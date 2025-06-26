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

// Data untuk admin
const adminData = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
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
  ],
}

// Data untuk user biasa
const userData = {
  user: {
    name: "Regular User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Back to Home",
      url: "/",
      icon: IconHome,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: 'admin' | 'user';
}

export function AppSidebar({ userRole, ...props }: AppSidebarProps) {
  // Pilih data berdasarkan role
  const data = userRole === 'admin' ? adminData : userData

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Sea Catering</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
