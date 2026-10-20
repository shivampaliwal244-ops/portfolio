// Type definitions for portfolio components

export interface SkillCategory {
  id: string;
  icon: string;
  title: string;
  color: string;
  items: string[];
}

export interface PersonalInfo {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface ProjectTechStack {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  ai?: string[];
  state?: string[];
  auth?: string[];
  payment?: string[];
  orm?: string[];
  tools?: string[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  techStack: ProjectTechStack;
  features: string[];
  image: string;
  liveLink: string;
  githubLink: string;
  gradient: string;
  accentColor: string;
  secondaryAccent: string;
  category?: string;
  problemStatement?: string;
  purpose?: string;
  implementation?: string;
  architecture?: string;
  workflow?: string;
  challenges?: string;
  setupInstructions?: string;
}

export interface AboutMeText {
  paragraph1: string;
  paragraph2: string;
  highlights: string[];
}
