// components/DashboardLayout.tsx
import { type ReactNode } from "react";

// Your previous UserNav component
import Sidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

import { SessionProvider } from "next-auth/react";
import ModeToggle from "@/components/shared/ToggleButton";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SessionProvider>
      <SidebarProvider>
        <Sidebar />
        <main>
          <header className="fixed flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
        </main>
        <div className="mx-5 mb-6 mt-16 min-h-full w-full rounded-xl border ">
          {children}
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
};

export default DashboardLayout;
