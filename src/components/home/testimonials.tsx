import Marquee from "react-fast-marquee";
import TestimonialCard from "./card-testimonial";
import type { Testimonial } from "@/types/features";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {

  return (

    <div id="testimonials" className="flex justify-center items-center py-20">
      <div className="h-full w-full">
        <h2 className="mb-12 text-4xl md:text-5xl font-bold text-center tracking-tight px-6">
          Testimonials
        </h2>
        <div className="relative">
          <div className="z-10 absolute left-0 inset-y-0 w-[15%] bg-gradient-to-r from-background to-transparent" />
          <div className="z-10 absolute right-0 inset-y-0 w-[15%] bg-gradient-to-l from-background to-transparent" />
          <Marquee pauseOnClick direction="left" className="[--duration:20s]">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                {...testimonial}
              />
            ))}
          </Marquee>
          <Marquee pauseOnClick direction="right" className="[--duration:20s]">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                {...testimonial}
              />
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;