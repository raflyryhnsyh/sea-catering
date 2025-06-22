import KeyFeatures from '@/components/home/key-features';
import Footer from '@/components/home/footer';
import Overview from '@/components/home/overview';
import Testimonials from '@/components/home/testimonials';
import PageWithNavbar from '@/layouts/PageWithNavbar';
import { Edit, MonitorCheck, Truck } from "lucide-react";

const allFeatures = [
  {
    icon: Edit,
    title: "Customizable Meals",
    description:
      "Tailor your meals to fit your specific dietary requirements, preferences, and health goals. Choose from a variety of ingredients and meal plans.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description:
      "We deliver our healthy meals to major cities throughout Indonesia, ensuring you have access to nutritious food wherever you are.",
  },
  {
    icon: MonitorCheck,
    title: "Nutritional Transparency",
    description:
      "Access detailed nutritional information for each meal, including calorie count, macronutrient breakdown, and allergen information.",
  },
];

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    rating: 4.8,
    comment:
      "This product has completely transformed the way we work. The efficiency and ease of use are unmatched!",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Sophia Lee",
    rating: 5.0,
    comment:
      "This tool has saved me hours of work! The analytics and reporting features are incredibly powerful.",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    id: 3,
    name: "Michael Johnson",
    rating: 5.0,
    comment:
      "An amazing tool that simplifies complex tasks. Highly recommended for professionals in the industry.",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    name: "Emily Davis",
    rating: 3.3,
    comment:
      "I've seen a significant improvement in our team's productivity since we started using this service.",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: 5,
    name: "Daniel Martinez",
    rating: 2.6,
    comment:
      "The best investment we've made! The support team is also super responsive and helpful.",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: 6,
    name: "Jane Smith",
    rating: 4.5,
    comment:
      "The user experience is top-notch! The interface is clean, intuitive, and easy to navigate.",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

export default function Dashboard() {
  return (
    <PageWithNavbar>
      <Overview />
      <KeyFeatures features={allFeatures} />
      <Testimonials testimonials={testimonials} />
      <Footer />
    </PageWithNavbar>
  );
}