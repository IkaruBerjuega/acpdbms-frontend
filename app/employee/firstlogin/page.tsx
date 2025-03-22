import FirstLogin from '@/components/ui/firstlogin/first-login';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Page() {
  return (
    <main className='w-full h-auto flex justify-center flex-col'>
      <SidebarTrigger />
      <FirstLogin />
    </main>
  );
}
