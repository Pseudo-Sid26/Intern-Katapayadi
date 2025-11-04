import { Outlet } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { MainNav } from '@/components/main-nav';
import { TopBar } from '@/components/top-bar';

export function AppLayout() {
  return (
    <div className="font-body antialiased min-h-screen bg-background">
      <SidebarProvider>
        <Sidebar className="flex flex-col border-r">
          <SidebarHeader className="p-0 border-b">
            <SiteHeader />
          </SidebarHeader>
          <SidebarContent className="p-0">
            <MainNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <TopBar />
          <main className="min-h-[calc(100vh-4rem)]">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
