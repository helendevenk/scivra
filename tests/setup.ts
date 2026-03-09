import "@testing-library/jest-dom/vitest";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables for tests
config({ path: resolve(__dirname, "../.env") });
