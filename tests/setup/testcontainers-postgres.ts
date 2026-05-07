import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import type { TestProject } from 'vitest/node';

let container: StartedPostgreSqlContainer | null = null;

export async function setup(project: TestProject) {
  container = await new PostgreSqlContainer('postgres:17-alpine')
    .withDatabase('scivra_test')
    .withUsername('test')
    .withPassword('test')
    .start();

  const databaseUrl = container.getConnectionUri();
  process.env.DATABASE_URL_TEST = databaseUrl;
  project.provide('databaseUrlTest', databaseUrl);
}

export async function teardown() {
  if (!container) {
    return;
  }

  await container.stop();
  container = null;
  delete process.env.DATABASE_URL_TEST;
}

declare module 'vitest' {
  export interface ProvidedContext {
    databaseUrlTest: string;
  }
}
