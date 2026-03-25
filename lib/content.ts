import fs from "fs";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

export type Stat = { value: string; label: string; sub: string };
export type Education = {
  school: string;
  degree: string;
  location: string;
  graduation: string;
  award: string;
};
export type Experience = {
  title: string;
  company: string;
  location: string;
  period: string;
  type: string;
  impact: string;
  bullets: string[];
  tags: string[];
};
export type Project = {
  number: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  solution: string | string[];
  why: string;
  results: string[];
  tools: string[];
  featured: boolean;
  hidden?: boolean;
  github: string;
  live: string;
};
export type SkillGroup = { category: string; icon: string; skills: string[] };
export type Course = { name: string; url: string };
export type CourseGroup = { category: string; courses: Course[] };

export type Content = {
  hero: {
    badge: string;
    name: string;
    role: string;
    tagline: string;
    github: string;
    linkedin: string;
    email: string;
  };
  about: {
    headline: string;
    bio1: string;
    bio2: string;
    stats: Stat[];
    interests: string[];
    education: Education;
  };
  experience: Experience[];
  projects: Project[];
  skills: {
    groups: SkillGroup[];
    coursework: CourseGroup[];
  };
  contact: {
    headline: string;
    subtext: string;
  };
};

export function getContent(): Content {
  const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
  return JSON.parse(raw) as Content;
}

export function saveContent(content: Content): void {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
}
