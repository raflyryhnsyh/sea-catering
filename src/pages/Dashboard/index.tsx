import Hero from '@/components/dashboard/hero';
import { Button } from '@/components/ui/button';
import PageWithNavbar from '@/layouts/PageWithNavbar';

export default function Dashboard() {
  return (
    <PageWithNavbar>
      <div className="min-h-screen flex items-center justify-center" >
        <Hero />
      </div>
    </PageWithNavbar>
  );
}