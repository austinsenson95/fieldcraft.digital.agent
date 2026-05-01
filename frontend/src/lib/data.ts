export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  image: string;
  link?: string;
  featured: boolean;
  year: number;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "freedom-business-engine",
    title: "Freedom Business Engine",
    slug: "freedom-business-engine",
    description:
      "A personalised portal for a freedom business coach — AI-powered blueprint generation, branded content delivery, and integrated payments.",
    techStack: ["Next.js", "Claude API", "Razorpay", "Remotion", "Supabase"],
    image: "/images/case-study-freedom.jpg",
    link: "#",
    featured: true,
    year: 2025,
  },
];
