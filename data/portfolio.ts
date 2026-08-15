export type Project = {
  id: string;
  title: string;
  period: string;
  status: string;
  description: string;
  technologies: string[];
  features: string[];
  github?: string;
  live?: string;
  tone: "cyan" | "violet";
};

export const profile = {
  name: "Rishikesh Gupta",
  role: "Full Stack Developer",
  email: "guptapranjal68@gmail.com",
  phone: "7291888193",
  location: "Noida, Uttar Pradesh",
  github: "https://github.com/pranjalboss123",
  linkedin: "https://in.linkedin.com/in/rishikeshguptaa",
  headline: "BUILDING\nINTELLIGENT\nSYSTEMS.",
  summary: "Full Stack Developer experienced in building scalable REST APIs and AI-integrated web apps using Next.js, Node.js, Express.js, and MongoDB.",
};

export const skillGroups = [
  { title: "Frontend Canvas", index: "02.1", level: "Advanced", summary: "Modern responsive interfaces, application architecture, and polished user interactions.", projects: ["NyayaSetu", "Shakti", "Krishi Setu"], skills: ["Next.js", "React.js", "Tailwind CSS", "TypeScript", "JavaScript"] },
  { title: "Core Systems", index: "02.2", level: "Advanced", summary: "REST APIs, data design, authentication, and backend workflows built for deployment.", projects: ["NyayaSetu", "Krishi Setu", "Travel itinerary backend"], skills: ["Node.js", "Express.js", "REST APIs", "MongoDB", "MySQL", "Firebase"] },
  { title: "AI & Tooling", index: "02.3", level: "Applied", summary: "Computer vision, AI integration, model-assisted workflows, testing, and collaboration tooling.", projects: ["Shakti", "NyayaSetu"], skills: ["OpenCV", "TensorFlow", "Prompt Engineering", "GitHub", "Postman", "GitLab"] },
];

export const projects: Project[] = [
  {
    id: "nyayasetu",
    title: "NyayaSetu",
    period: "FEB 2025 - APR 2025",
    status: "[ ACTIVE ]",
    description: "An AI-powered legal analytics platform that analyzes complaints and generates structured case insights for faster legal evaluation.",
    technologies: ["Next.js", "Firebase", "Auth.js", "Flask", "AI"],
    features: ["Structured complaint analysis", "Procedural gap detection", "Evidential loophole identification"],
    github: "https://github.com/pranjalboss123/NyayaSetu",
    live: "https://nyayasetu-rishikesh.vercel.app/",
    tone: "cyan",
  },
  {
    id: "shakti",
    title: "Shakti",
    period: "AUG 2024 - NOV 2024",
    status: "[ HACKATHON ]",
    description: "A real-time women’s safety surveillance system with live video processing and dashboard-based situational analysis.",
    technologies: ["Next.js", "Python", "OpenCV", "TensorFlow"],
    features: ["Real-time video processing", "Gender detection", "Live graph visualization"],
    github: "https://github.com/pranjalboss123/SHAKTI-Women-Security-Surveillance-System-",
    tone: "violet",
  },
  {
    id: "krishi-setu", title: "Krishi Setu", period: "HACKNOVATE 6.0", status: "[ FINALIST ]",
    description: "A direct marketplace designed to connect farmers and consumers, supporting product listings, pricing, inventory, and a simpler agricultural supply chain.",
    technologies: ["React", "Node.js", "Express.js", "MongoDB"], features: ["Farmer-first marketplace", "Inventory management", "Real-time price updates"],
    github: "https://github.com/pranjalboss123/Khet-Market--MERN-", live: "https://krishisetu-rishikesh.vercel.app", tone: "cyan",
  },
  {
    id: "swar-shiksha", title: "Swar Shiksha", period: "CODEATHON", status: "[ TOP 3 ]",
    description: "An interactive classical Indian music learning platform with structured lessons, practice modules, virtual instruments, and progress tracking.",
    technologies: ["HTML", "CSS", "JavaScript"], features: ["Raga and taal lessons", "Interactive practice modules", "Audio and visual learning aids"],
    github: "https://github.com/pranjalboss123/Swar-Shiksha", live: "https://swarshiksha-rishikesh.vercel.app", tone: "violet",
  },
  {
    id: "gym-management", title: "Gym Management System", period: "ACADEMIC PROJECT", status: "[ SYSTEM ]",
    description: "An operations platform for fitness centers that covers membership, attendance, workout plans, billing, and facility reporting.",
    technologies: ["Python", "SQL"], features: ["Member and attendance management", "Workout and billing workflows", "Usage and financial reporting"],
    github: "https://github.com/pranjalboss123/Gym-management", tone: "cyan",
  },
];

export const experiences = [
  {
    role: "Full Stack Developer Intern",
    organization: "Antmore Labs · Remote",
    period: "MAR 2025 - SEP 2025",
    description: "Built web components and APIs with Next.js, React, and TypeScript; optimized SSR API calls, refactored Zustand usage, and implemented JWT-based authentication.",
  },
  {
    role: "Backend Developer Intern",
    organization: "Integral Solutions · Remote",
    period: "MAY 2025 - JUN 2025",
    description: "Developed Node.js APIs for a YouTube-data travel app, including video fetching, transcript extraction, summarization, MongoDB schema design, and endpoint testing.",
  },
];

export const achievements = [
  "Smart India Hackathon 2024 · College-level final submission",
  "Hacknovate 6.0 · Finalist, Top 50 of 150+ teams",
  "Codeathon · Top 3 rank",
];
