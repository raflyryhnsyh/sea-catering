import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";

const Overview = () => {
  return (
    <div id="overview" className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-12">
      {/* Text Content */}
      <div className="flex flex-col gap-6 max-w-2xl">
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold !leading-[1.2] tracking-tight text-center lg:text-left">
          Healthy Meals, Anytime, Anywhere
        </h1>
        <p className="xs:text-lg text-center lg:text-left">
          Welcome to SEA Catering, your premier choice for customizable healthy meals delivered across Indonesia. 
          We specialize in providing nutritious, delicious meals tailored to your dietary needs and preferences, 
          ensuring you eat well no matter where you are.
        </p>
        <div className="flex justify-center lg:justify-start">
          <Button
            size="lg"
            className="w-fit px-8 rounded-full text-base"
          >
            Order Now <ArrowUpRight className="!h-5 !w-5" />
          </Button>
        </div>
      </div>
      
      {/* Image Content */}
      <div className="flex-shrink-0">
        <img
          src="../../public/home.jpg"
          alt="Healthy Meals"
          className="w-full max-w-lg lg:max-w-2xl h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl"
        />
      </div>
    </div>
  );
};

export default Overview;