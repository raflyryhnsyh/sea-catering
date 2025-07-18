import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconHome,
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

export function AppSidebar({ userRole: propUserRole, ...props }: AppSidebarProps) {
  const { user } = useAuth()

  // Dapatkan role dengan prioritas yang jelas
  const getCurrentRole = () => {
    // 1. Prop role (highest priority)
    if (propUserRole) return propUserRole;

    // 3. localStorage sebagai fallback
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) return storedRole;

    // 4. Default fallback
    return 'user';
  };

  const effectiveRole = getCurrentRole();

  // Navigation items berdasarkan role
  const getNavItems = () => {
    if (effectiveRole === 'admin') {
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
          title: "Back to Home",
          url: "/",
          icon: IconHome,
        },
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
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5">
              <IconInnerShadowTop className="!size-5" />
              <span className="text-base font-semibold">Sea Catering</span>
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