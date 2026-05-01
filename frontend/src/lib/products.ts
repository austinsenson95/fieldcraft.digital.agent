export interface DigitalProduct {
  id: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  stripeLink: string;
  category: "template" | "guide" | "toolkit" | "course";
  features: string[];
  badge?: string;
}

export const digitalProducts: DigitalProduct[] = [
  {
    id: "personal-brand-starter",
    title: "Personal Brand Starter Kit",
    tagline: "Everything you need to launch your personal brand in 7 days",
    description:
      "A complete bundle of Notion templates, Canva assets, and a step-by-step playbook for building a magnetic personal brand. Built from my own journey — no fluff, just what works.",
    price: 49,
    currency: "USD",
    stripeLink: "https://buy.stripe.com/test_placeholder_1",
    category: "template",
    badge: "Bestseller",
    features: [
      "Brand positioning worksheet",
      "30-day content calendar template",
      "Bio & headline formulas",
      "Visual identity starter pack",
      "LinkedIn profile optimization guide",
    ],
  },
  {
    id: "solo-operator-blueprint",
    title: "Solo Operator Blueprint",
    tagline: "Systems that let one person run a $10K/month business",
    description:
      "The exact tools, automations, and workflows I use to run Fieldcraft Digital solo. From client onboarding to project delivery — documented and templated.",
    price: 79,
    currency: "USD",
    stripeLink: "https://buy.stripe.com/test_placeholder_2",
    category: "toolkit",
    features: [
      "Client onboarding flow (Notion + Airtable)",
      "Project scoping template",
      "Pricing & proposal framework",
      "Invoice & contract templates",
      "Weekly review dashboard",
    ],
  },
  {
    id: "productized-service-guide",
    title: "Productized Service Guide",
    tagline: "Turn your freelancing into a product business",
    description:
      "Stop trading hours for dollars. This guide shows you how to package your expertise into repeatable, sellable products — with real examples from my own pivot.",
    price: 39,
    currency: "USD",
    stripeLink: "https://buy.stripe.com/test_placeholder_3",
    category: "guide",
    features: [
      "Service → product mapping framework",
      "Pricing psychology breakdown",
      "Landing page copy template",
      "Delivery automation checklist",
      "Case study: my first $1K digital product",
    ],
  },
];
