import type { KeyFeature } from "@/types/features";
import CardFeature from "./card-feature";

interface KeyFeaturesProps {
  features: KeyFeature[];
}

const KeyFeatures = ({ features }: KeyFeaturesProps) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-12">
      <div id="features" className="w-full py-12 xs:py-20 px-6">
        <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-center">
            Our Key Features
        </h2>
        <p className="items-center justify-center text-lg text-center mt-4 max-w-2xl mx-auto">
          At SEA Catering, we are committed to providing exceptional service and quality meals that support your health and wellness journey.
        </p>
        <div className="w-full max-w-screen-lg mx-auto mt-10 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
                <CardFeature
                    key={feature.title}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                />
            ) )}
        </div>
        </div>
    </div>
  );
};

export default KeyFeatures;