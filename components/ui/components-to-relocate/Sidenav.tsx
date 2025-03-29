'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function SideNav({
  pages,
}: {
  pages: { pageName: string; url: string }[];
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className='w-[200px] h-full space-y-1'>
      {pages.map((page) => (
        <Link
          key={page.pageName}
          href={page.url}
          className={clsx(
            'flex h-[48px] items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-maroon-100 hover:text-maroon-700 md:flex-none md:justify-start md:p-2 md:px-3',
            {
              'bg-maroon-100 text-maroon-700': pathname === page.url,
            }
          )}
        >
          {page.pageName}
        </Link>
      ))}
    </div>
  );
}
