import Link from 'next/link';
import { Icons } from '@/components/icons';

export function SiteHeader() {
  return (
    <div className="flex w-full items-center gap-2 p-2">
      <Link href="/" className="flex items-center gap-3">
        <Icons.logo className="h-8 w-8 text-primary" />
        <span className="font-headline text-xl font-bold group-data-[collapsible=icon]:hidden">Katapayadi Detectives</span>
      </Link>
    </div>
  );
}
