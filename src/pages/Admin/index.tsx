import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      <h1 className="text-red-500" >Welcome to Sea Catering</h1>
        <Button variant="destructive" className="m-4">
            Click Me
        </Button>
    </div>
  );
}