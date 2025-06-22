import type { KeyFeature } from "@/types/features";

const CardFeature = ({ icon: IconComponent, title, description }: KeyFeature) => {
    return (
        <div className="flex flex-col bg-background border rounded-xl py-6 px-5">
            <div className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                <IconComponent className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold">{title}</span>
            <p className="mt-1 text-foreground/80 text-[15px]">
            {description}
            </p>
        </div>
    )
}

export default CardFeature;