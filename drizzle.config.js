import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://Ai_Mock_Interview_owner:bc5Fn4peaxBH@ep-wandering-leaf-a13f081i.ap-southeast-1.aws.neon.tech/Ai_Mock_Interview?sslmode=require",
  },
});
