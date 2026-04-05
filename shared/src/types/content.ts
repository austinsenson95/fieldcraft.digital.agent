// Content model types shared across the stack

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  techTags: string[];
  metrics: Array<{ value: string; label: string }>;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface SocialLink {
  platform: string;
  label?: string;
  url: string;
}
