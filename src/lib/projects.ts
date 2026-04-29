import project1 from "@/assets/crypto-wallet-interface.jpg";
import project3 from "@/assets/social-media-app-interface.png";

export const projects = [
  {
    title: "LogicForge - AI-Proof Technical Evaluation",
    date: "Feb-Mar 2026",
    description:
      "Built a gamified technical evaluation platform that tests engineering intuition through a Turborepo monorepo, Next.js client, API gateway, WebSocket game services, question engine, anti-cheat scoring, and a Go code runner.",
    tags: ["TypeScript", "Next.js", "Turborepo", "WebSockets", "Redis", "PostgreSQL", "MongoDB", "Docker", "Go"],
    image: "/logicforge-main.png",
    links: {
      github: "https://github.com/SaswatBarai/logic-forge",
      website: "https://logicforge.saswat.app/",
    },
  },
  {
    title: "LMS Microservices Platform",
    date: "Oct 2025-Present",
    description:
      "Architected a scalable LMS using Node.js and TypeScript microservices, securing 10+ API endpoints via Kong API Gateway and HashiCorp Vault to support 1,000+ concurrent users.",
    tags: ["Node.js", "TypeScript", "Kafka", "Redis", "Kong", "Vault"],
    image: project1,
    links: { github: "#" },
  },
  {
    title: "Hiky - Real-time Messaging",
    date: "May-Sept 2024",
    description:
      "Built a real-time messaging platform with React.js and Node.js, achieving sub-100ms latency using WebSockets and Redis Pub/Sub for scalable cross-instance communication.",
    tags: ["React.js", "Node.js", "WebSockets", "Redis", "JWT/PASETO"],
    image: project3,
    links: { github: "#" },
  },
];
