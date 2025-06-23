import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/sidebar/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (

    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>

  )
}


export default AdminLayout;