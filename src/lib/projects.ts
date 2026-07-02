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
    caseStudy: {
      problem:
        "Take-home coding assignments and multiple-choice quizzes are trivial to outsource to an LLM, so they've stopped signaling engineering intuition. LogicForge needed a format that scores how a candidate reasons under time pressure — debugging, tracing, and predicting code behavior — rather than what code they can generate.",
      architecture: [
        "Turborepo monorepo splitting the Next.js client, API gateway, WebSocket game services, question engine, anti-cheat scoring, and a Go code runner into independently deployable packages sharing typed contracts.",
        "WebSocket game services keep each candidate's session state in Redis so scoring and timers survive service restarts without dropping an in-progress round.",
        "A separate Go code runner isolates untrusted candidate code execution from the Node.js services, keeping the blast radius of a malicious submission contained to a disposable sandbox.",
        "PostgreSQL holds structured evaluation/session data; MongoDB stores the less-structured question bank and anti-cheat event logs, split by access pattern rather than forcing one database to do both jobs.",
      ],
      contribution:
        "Designed the monorepo boundaries and the WebSocket session-state model, and built the anti-cheat scoring pipeline that flags suspicious answer timing/patterns during a live round.",
      metrics: [
        "9 independently deployable services in one Turborepo build graph",
        "Real-time scoring with sub-second WebSocket round-trip during live evaluation rounds",
      ],
    },
  },
  {
    title: "LMS Microservices Platform",
    date: "Oct 2025-Present",
    description:
      "Architected a scalable LMS using Node.js and TypeScript microservices, securing 10+ API endpoints via Kong API Gateway and HashiCorp Vault to support 1,000+ concurrent users.",
    tags: ["Node.js", "TypeScript", "Kafka", "Redis", "Kong", "Vault"],
    image: project1,
    links: { github: "https://github.com/SaswatBarai/lms-platform" },
    caseStudy: {
      problem:
        "A college-scale Learning Management System needs role-aware access (Dean, HOD, Faculty, Student), secrets that don't live in application config, and an event backbone that keeps enrollment, grading, and notification services in sync without tight coupling.",
      architecture: [
        "Node.js/TypeScript microservices behind Kong API Gateway, which centralizes routing, rate limiting, and auth enforcement instead of duplicating that logic in every service.",
        "HashiCorp Vault issues and rotates service credentials and API secrets, so no service ships a long-lived static secret.",
        "PASETO-based authentication with single-device-login enforcement, closing the session-replay gap that plain JWT-in-localStorage setups leave open.",
        "Kafka as the event bus between services (enrollment, grading, notifications) so a spike in one domain doesn't back-pressure the others synchronously.",
        "Redis for session/cache state shared across service instances, keeping the services themselves stateless and horizontally scalable.",
      ],
      contribution:
        "Owned the overall service architecture and the API gateway/Vault integration, and implemented the RBAC model spanning Dean, HOD, Faculty, and Student roles.",
      metrics: [
        "10+ API endpoints secured behind gateway-enforced auth and rate limiting",
        "Designed to support 1,000+ concurrent users",
      ],
    },
  },
  {
    title: "Hiky - Real-time Messaging",
    date: "May-Sept 2024",
    description:
      "Built a real-time messaging platform with React.js and Node.js, achieving sub-100ms latency using WebSockets and Redis Pub/Sub for scalable cross-instance communication.",
    tags: ["React.js", "Node.js", "WebSockets", "Redis", "JWT/PASETO"],
    image: project3,
    links: { github: "https://github.com/SaswatBarai/Hiky" },
    caseStudy: {
      problem:
        "A single-instance WebSocket server can't scale horizontally on its own — a message sent by a client connected to instance A needs to reach a recipient connected to instance B without a shared broker in between.",
      architecture: [
        "Redis Pub/Sub as the cross-instance message bus: each server instance subscribes to relevant channels and republishes incoming WebSocket messages, so horizontal scaling doesn't break delivery.",
        "React.js client maintaining a persistent WebSocket connection with reconnection/backoff handling for flaky networks.",
        "JWT/PASETO-based auth on the WebSocket handshake, avoiding an unauthenticated socket that only gets checked after the first message.",
      ],
      contribution:
        "Built the Redis Pub/Sub fan-out layer connecting multiple Node.js instances and the reconnection logic on the client that keeps message delivery consistent across drops.",
      metrics: [
        "Sub-100ms message latency under test load",
        "Horizontally scalable across multiple server instances via Redis Pub/Sub",
      ],
    },
  },
];
