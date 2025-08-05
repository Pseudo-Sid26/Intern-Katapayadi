'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icons } from '@/components/icons';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { BarChart, BrainCircuit, Gamepad2, Users, BookOpen, User } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Icons.home },
  { href: '/self-quizzing', label: 'Self Quizzing', icon: Gamepad2 },
  { href: '/multiplayer', label: 'Multiplayer', icon: Users },
  { href: '/brain-enhancement', label: 'Brain Enhancement', icon: BrainCircuit },
  { href: '/leaderboard', label: 'Leaderboard', icon: BarChart },
  { href: '/encoding-charts', label: 'Encoding Charts', icon: BookOpen },
  { href: '/profile', label: 'Profile', icon: User },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
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
