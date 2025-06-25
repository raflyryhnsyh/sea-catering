export interface MealPlan {
    id: number;
    name: string;
    price: number;
    image?: string;
    isPopular: boolean;
    description: string;
    benefits: string[];
}

export interface KeyFeature {
    title: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface Testimonial {
    id: number;
    name: string;
    rating: number;
    comment: string;
    avatar: string;
}

export interface SidebarAdmin {
    title: string;
    url: string;
    icon: React.ComponentType<any>;
}