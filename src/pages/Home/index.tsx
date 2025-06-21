import Features from '@/components/dashboard/features';
import Footer from '@/components/dashboard/footer';
import Hero from '@/components/dashboard/hero';
import Testimonials from '@/components/dashboard/testimonials';
import PageWithNavbar from '@/layouts/PageWithNavbar';

export default function Dashboard() {
  return (
    <PageWithNavbar>
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </PageWithNavbar>
  );
}