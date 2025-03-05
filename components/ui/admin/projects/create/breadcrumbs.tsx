import { clsx } from 'clsx';
import Link from 'next/link';
import { MdOutlineNavigateNext } from 'react-icons/md';

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav
      aria-label='Breadcrumb'
      className='block'
    >
      <ol className={clsx('flex text-md ')}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={clsx(
              'flex items-center',
              breadcrumb.active ? 'text-maroon-700' : 'text-maroon-600'
            )}
          >
            <Link
              href={breadcrumb.href}
              className='text-md font-bold hover:underline'
            >
              {breadcrumb.label}
            </Link>
            {index < breadcrumbs.length - 1 ? <MdOutlineNavigateNext /> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
