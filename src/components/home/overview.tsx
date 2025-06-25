import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const Overview = () => {
  return (
    <div id="overview" className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-16">
      {/* Text Content */}
      <div className="flex flex-col gap-6 max-w-2xl">
        <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold !leading-[1.1] tracking-tight text-center lg:text-left">
          Healthy Meals,{" "}
          <span className="text-primary">Anytime</span>,{" "}
          <span className="text-primary">Anywhere</span>
        </h1>
        <p className="text-lg xs:text-xl text-muted-foreground text-center lg:text-left leading-relaxed">
          Welcome to SEA Catering, your premier choice for customizable healthy meals delivered across Indonesia.
          We specialize in providing nutritious, delicious meals tailored to your dietary needs and preferences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Button
            size="lg"
            className="w-fit px-8 rounded-full text-base h-12"
            asChild
          >
            <Link to="/menu">
              Order Now <ArrowUpRight className="!h-5 !w-5 ml-2" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-fit px-8 rounded-full text-base h-12"
            asChild
          >
            <Link to="/contact">
              Learn More
            </Link>
          </Button>
        </div>
      </div>

      {/* Image Content */}
      <div className="flex-shrink-0">
        <img
          src="/home.jpg"
          alt="Healthy Meals"
          className="w-full max-w-lg lg:max-w-2xl h-80 sm:h-96 lg:h-[500px] object-cover rounded-3xl shadow-2xl"
        />
      </div>
    </div>
  );
};

export default Overview;