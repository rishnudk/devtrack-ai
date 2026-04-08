import "dotenv/config";
import { db } from "./index";
import { topicCategories, subtopics, subtopic_notes } from "./schema";
import { generateId } from "../utils";

// Replace this with your actual admin user ID from the database
const ADMIN_USER_ID = process.argv[2] || "YOUR_ADMIN_USER_ID";

if (ADMIN_USER_ID === "YOUR_ADMIN_USER_ID") {
  console.error("❌ Please provide your admin user ID as a command-line argument:");
  console.error("   npx tsx lib/db/seed-catalog.ts <your-user-id>");
  process.exit(1);
}

interface SeedCategory {
  name: string;
  icon: string;
  description: string;
  subtopics: {
    name: string;
    description: string;
    concepts: string[];
  }[];
}

const seedData: SeedCategory[] = [
  {
    name: "Frontend Frameworks",
    icon: "monitor",
    description: "Libraries and frameworks for building user interfaces",
    subtopics: [
      { name: "React", description: "A JavaScript library for building user interfaces", concepts: ["React Hooks", "React Router", "State Management", "Server Components", "Component Patterns"] },
      { name: "Vue.js", description: "The progressive JavaScript framework", concepts: ["Vue Composition API", "Vue Router", "Pinia", "Vue Directives"] },
      { name: "Angular", description: "Platform for building mobile and desktop web apps", concepts: ["Angular Modules", "Angular Services", "RxJS", "Angular Forms", "Angular Pipes"] },
      { name: "Svelte", description: "Cybernetically enhanced web apps", concepts: ["Svelte Stores", "SvelteKit", "Svelte Animations"] },
      { name: "Next.js", description: "The React framework for the web", concepts: ["App Router", "Server Actions", "API Routes", "Middleware", "ISR/SSG/SSR"] },
    ],
  },
  {
    name: "Backend Frameworks",
    icon: "server",
    description: "Server-side frameworks and runtime environments",
    subtopics: [
      { name: "Express.js", description: "Fast, unopinionated web framework for Node.js", concepts: ["Middleware", "Routing", "Error Handling", "Template Engines"] },
      { name: "NestJS", description: "Progressive Node.js framework", concepts: ["Modules & Providers", "Guards & Interceptors", "Pipes", "Microservices"] },
      { name: "Django", description: "High-level Python web framework", concepts: ["Django ORM", "Django REST Framework", "Middleware", "Authentication"] },
      { name: "FastAPI", description: "Modern Python web framework", concepts: ["Pydantic Models", "Dependency Injection", "Background Tasks", "WebSockets"] },
      { name: "Spring Boot", description: "Java-based framework for microservices", concepts: ["Spring MVC", "Spring Data JPA", "Spring Security", "Actuator"] },
    ],
  },
  {
    name: "Databases",
    icon: "database",
    description: "Database systems and data storage solutions",
    subtopics: [
      { name: "PostgreSQL", description: "Advanced open-source relational database", concepts: ["SQL Joins", "Indexing", "Transactions", "Window Functions", "JSON Operations"] },
      { name: "MongoDB", description: "Document-oriented NoSQL database", concepts: ["Aggregation Pipeline", "Schema Design", "Indexing", "Replication"] },
      { name: "Redis", description: "In-memory data structure store", concepts: ["Caching Strategies", "Pub/Sub", "Data Structures", "Persistence"] },
      { name: "MySQL", description: "Popular open-source relational database", concepts: ["Stored Procedures", "Views", "Replication", "Query Optimization"] },
      { name: "SQLite", description: "Lightweight embedded database", concepts: [] },
    ],
  },
  {
    name: "ORMs & Query Builders",
    icon: "layers",
    description: "Object-relational mapping and query building tools",
    subtopics: [
      { name: "Drizzle ORM", description: "TypeScript ORM with SQL-like syntax", concepts: ["Schema Definition", "Migrations", "Queries", "Relations"] },
      { name: "Prisma", description: "Next-generation Node.js and TypeScript ORM", concepts: ["Prisma Schema", "Prisma Client", "Migrations", "Seeding"] },
      { name: "TypeORM", description: "ORM for TypeScript and JavaScript", concepts: ["Entities", "Repositories", "Relations", "Query Builder"] },
      { name: "Sequelize", description: "Promise-based Node.js ORM", concepts: ["Models", "Associations", "Migrations", "Hooks"] },
    ],
  },
  {
    name: "Testing",
    icon: "flask-conical",
    description: "Testing frameworks and methodologies",
    subtopics: [
      { name: "Jest", description: "JavaScript testing framework", concepts: ["Unit Testing", "Mocking", "Snapshot Testing", "Coverage"] },
      { name: "Vitest", description: "Blazing fast unit test framework", concepts: ["Configuration", "Mocking", "UI Testing"] },
      { name: "Cypress", description: "End-to-end testing framework", concepts: ["E2E Testing", "Component Testing", "Custom Commands", "Fixtures"] },
      { name: "Playwright", description: "Cross-browser end-to-end testing", concepts: ["Cross-Browser Testing", "Page Objects", "API Testing", "Codegen"] },
      { name: "React Testing Library", description: "Testing utilities for React", concepts: ["Render & Queries", "User Events", "Async Testing"] },
    ],
  },
  {
    name: "DevOps & Deployment",
    icon: "cloud",
    description: "Infrastructure, CI/CD, and deployment tools",
    subtopics: [
      { name: "Docker", description: "Containerization platform", concepts: ["Dockerfile", "Docker Compose", "Volumes", "Networking", "Multi-stage Builds"] },
      { name: "CI/CD", description: "Continuous integration and deployment", concepts: ["GitHub Actions", "GitLab CI", "Pipeline Design", "Automated Testing"] },
      { name: "AWS", description: "Amazon Web Services cloud platform", concepts: ["EC2", "S3", "Lambda", "RDS", "IAM"] },
      { name: "Vercel", description: "Frontend cloud platform", concepts: ["Deployment Config", "Edge Functions", "Environment Variables", "Domains"] },
      { name: "Nginx", description: "High-performance web server", concepts: ["Reverse Proxy", "Load Balancing", "SSL/TLS", "Configuration"] },
    ],
  },
  {
    name: "TypeScript",
    icon: "file-code",
    description: "TypeScript language features and patterns",
    subtopics: [
      { name: "Core TypeScript", description: "Fundamental TypeScript concepts", concepts: ["Type Annotations", "Interfaces vs Types", "Generics", "Enums"] },
      { name: "Advanced Types", description: "Advanced type system features", concepts: ["Utility Types", "Conditional Types", "Mapped Types", "Template Literals"] },
      { name: "TypeScript with React", description: "Using TypeScript in React projects", concepts: ["Component Props", "Hooks Typing", "Context Typing", "Event Typing"] },
    ],
  },
  {
    name: "Authentication & Security",
    icon: "shield",
    description: "Authentication methods and security practices",
    subtopics: [
      { name: "JWT", description: "JSON Web Token authentication", concepts: ["Token Structure", "Access/Refresh Tokens", "Token Storage"] },
      { name: "OAuth 2.0", description: "Authorization framework", concepts: ["Authorization Code Flow", "PKCE", "Scopes", "OpenID Connect"] },
      { name: "Session-Based Auth", description: "Traditional session authentication", concepts: ["Cookie Management", "Session Storage", "CSRF Protection"] },
      { name: "Better Auth", description: "Modern authentication library", concepts: ["Email/Password", "Social Login", "Session Management", "Middleware"] },
    ],
  },
  {
    name: "API Design",
    icon: "webhook",
    description: "API architecture and communication patterns",
    subtopics: [
      { name: "REST", description: "Representational State Transfer", concepts: ["Resource Design", "HTTP Methods", "Status Codes", "Pagination", "Versioning"] },
      { name: "GraphQL", description: "Query language for APIs", concepts: ["Schema Definition", "Resolvers", "Mutations", "Subscriptions", "Caching"] },
      { name: "tRPC", description: "End-to-end typesafe APIs", concepts: ["Router Definition", "Procedures", "Middleware", "React Integration"] },
      { name: "WebSockets", description: "Full-duplex communication protocol", concepts: ["Connection Lifecycle", "Rooms", "Broadcasting", "Reconnection"] },
    ],
  },
  {
    name: "Version Control",
    icon: "git-branch",
    description: "Source code management and collaboration",
    subtopics: [
      { name: "Git Fundamentals", description: "Core Git concepts and commands", concepts: ["Branching", "Merging", "Rebasing", "Cherry-pick", "Stashing"] },
      { name: "Git Workflows", description: "Team collaboration strategies", concepts: ["Git Flow", "Trunk-Based", "Feature Branches", "Release Management"] },
      { name: "GitHub", description: "Code hosting and collaboration platform", concepts: ["Pull Requests", "Code Review", "Issues", "GitHub Actions"] },
    ],
  },
  {
    name: "Package Managers & Build Tools",
    icon: "package",
    description: "Dependency management and build tooling",
    subtopics: [
      { name: "npm", description: "Node.js package manager", concepts: ["package.json", "Semantic Versioning", "Scripts", "Publishing"] },
      { name: "pnpm", description: "Fast, disk space efficient package manager", concepts: ["Workspaces", "Monorepo Setup", "Performance Benefits"] },
      { name: "Vite", description: "Next-generation frontend build tool", concepts: ["Configuration", "Plugins", "HMR", "Build Optimization"] },
      { name: "Webpack", description: "Module bundler", concepts: ["Loaders", "Plugins", "Code Splitting", "Tree Shaking"] },
      { name: "Turborepo", description: "High-performance monorepo build system", concepts: ["Pipeline Config", "Caching", "Remote Caching"] },
    ],
  },
  {
    name: "CSS & Styling",
    icon: "palette",
    description: "Styling approaches and CSS frameworks",
    subtopics: [
      { name: "Tailwind CSS", description: "Utility-first CSS framework", concepts: ["Utility Classes", "Custom Config", "Plugins", "Dark Mode"] },
      { name: "CSS Modules", description: "Locally scoped CSS", concepts: ["Scoping", "Composition", "Variables"] },
      { name: "Sass/SCSS", description: "CSS preprocessor", concepts: ["Nesting", "Mixins", "Functions", "Partials"] },
      { name: "CSS-in-JS", description: "Styling with JavaScript", concepts: ["Styled Components", "Emotion", "CSS Prop"] },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding catalog data...\n");

  let categoryCount = 0;
  let subtopicCount = 0;
  let conceptCount = 0;

  for (const cat of seedData) {
    const categoryId = generateId();

    await db.insert(topicCategories).values({
      id: categoryId,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      cretedBy: ADMIN_USER_ID,
    });
    categoryCount++;
    console.log(`  📁 ${cat.name}`);

    for (const sub of cat.subtopics) {
      const subtopicId = generateId();

      await db.insert(subtopics).values({
        id: subtopicId,
        categoryId,
        name: sub.name,
        description: sub.description,
        createdBy: ADMIN_USER_ID,
      });
      subtopicCount++;
      console.log(`    📄 ${sub.name}`);

      for (const conceptName of sub.concepts) {
        await db.insert(subtopic_notes).values({
          id: generateId(),
          subtopicId,
          name: conceptName,
          description: null,
          createdBy: ADMIN_USER_ID,
        });
        conceptCount++;
      }
    }
  }

  console.log(`\n✅ Seeded successfully!`);
  console.log(`   ${categoryCount} categories`);
  console.log(`   ${subtopicCount} subtopics`);
  console.log(`   ${conceptCount} concepts`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
