import { Button } from "../ui/button";
import type { MealPlan } from "@/types/features";

export default function CardLeft ({name, image, price, description}: MealPlan) {
    return (
        <div className="flex flex-row items-center justify-center w-1/2 h-full pt-24">
            <img src={image} alt="Sea Catering Logo" className="w-32 h-32 mb-4" />
            <div className="flex flex-col pl-16">
                <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
                <h1 className="font-bold text-gray-800">Rp. {price}</h1>
                <p className="text-gray-600 mt-2">{description}</p>
                <Button className="mt-4 bg-green-500 text-white hover:bg-green-600">
                    See More Details
                </Button>  
            </div>
        </div>
    )
}   