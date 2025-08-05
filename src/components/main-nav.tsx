'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icons } from '@/components/icons';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const navItems = [
  { href: '/', label: 'Game Modes', icon: Icons.home },
  { href: '/dynasties', label: 'Dynasty Ledger', icon: Icons.dynasties },
  { href: '/artifacts', label: 'Artifact Vault', icon: Icons.artifacts },
  { href: '/scan', label: 'Scan Fragment', icon: Icons.scan },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={{ children: item.label }}
              className="justify-start"
            >
              <Link href={item.href}>
                <Icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
