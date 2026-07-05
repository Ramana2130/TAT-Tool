import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4">
          <SidebarTrigger />

          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>

        <main className="flex-1 p-3">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}