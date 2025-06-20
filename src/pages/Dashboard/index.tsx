import Hero from '@/components/dashboard/hero';
import { Button } from '@/components/ui/button';
import PageWithNavbar from '@/layouts/PageWithNavbar';

export default function Dashboard() {
  return (
    <PageWithNavbar>
      <Hero />
      <div>
      <h1 className="text-red-500" >Welcome to Sea Catering</h1>
      <Button variant="destructive" className="m-4">
          Click Me
      </Button>
      </div>
    </PageWithNavbar>
  );
}