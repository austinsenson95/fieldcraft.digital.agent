// Shared API request/response types used by both frontend and backend

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

// Phase 3: Personalization demo
export interface PersonalizeRequest {
  businessName: string;
  industry?: string;
  colorPreference?: string;
}

export interface PortalConfig {
  name: string;
  colors: Record<string, string>;
  prompts: string[];
  layout: string;
}

export interface PersonalizeResponse {
  portalConfig: PortalConfig;
}
