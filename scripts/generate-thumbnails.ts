/**
 * Experiment Thumbnail Generator
 *
 * Generates missing experiment thumbnails using Gemini image generation API.
 * Style: dark navy background + neon cyan/blue glowing scientific illustrations.
 *
 * Usage:
 *   pnpm tsx scripts/generate-thumbnails.ts --dry-run       # List missing thumbnails
 *   pnpm tsx scripts/generate-thumbnails.ts --id friction-lab  # Generate one
 *   pnpm tsx scripts/generate-thumbnails.ts --all            # Generate all missing
 *   pnpm tsx scripts/generate-thumbnails.ts --all --delay 3  # With 3s delay between
 */

import 'dotenv/config';
import { readdirSync, existsSync, writeFileSync } from 'fs';
import { resolve, basename } from 'path';

const PROJECT_ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(PROJECT_ROOT, 'src/shared/lib/experiments/data');
const THUMBNAIL_DIR = resolve(PROJECT_ROOT, 'public/imgs/experiments');
const DELAY_DEFAULT_MS = 5000;

// ====== Style Prompt ======

const STYLE_PROMPT = `Create a 1024x1024 square thumbnail image for a science education app.

STRICT STYLE REQUIREMENTS:
- Background: very dark navy/black gradient (#0a0e27 to #0d1117)
- Main elements: neon cyan (#00e5ff) and blue (#3b82f6) glowing lines and shapes
- Style: minimalist, clean, vector-like scientific illustration
- Lighting: subtle glow/bloom effect on the main elements
- NO text, NO labels, NO numbers, NO letters anywhere in the image
- NO watermarks, NO borders
- The illustration should be centered and fill about 60-70% of the canvas
- Feel: futuristic, educational, like a high-end science app icon`;

function buildPrompt(title: string, description: string, subject: string): string {
  const subjectHints: Record<string, string> = {
    physics: 'Use physics-related imagery: waves, forces, circuits, orbits, springs, lenses, particles',
    chemistry: 'Use chemistry-related imagery: molecules, test tubes, atomic bonds, reaction diagrams, periodic elements',
    biology: 'Use biology-related imagery: cells, DNA helixes, organisms, ecosystems, plant structures',
    'earth-science': 'Use earth science imagery: geological layers, weather patterns, tectonic plates, ocean currents, stars',
    elementary: 'Use simple, friendly science imagery: magnets, light rays, simple machines, water drops',
    middle: 'Use accessible science imagery: force arrows, ecosystem webs, rock layers, weather systems',
  };

  const hint = subjectHints[subject] || subjectHints['physics'];

  return `${STYLE_PROMPT}

SUBJECT: ${title}
CONTEXT: ${description}
${hint}

Generate a single clean illustration representing this scientific concept.`;
}

// ====== Gemini API ======

interface GeminiImageResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        inlineData?: { mimeType: string; data: string };
        text?: string;
      }>;
    };
  }>;
}

async function generateImage(prompt: string): Promise<Buffer> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set in .env');

  // Use Gemini 2.5 Flash Image (native image generation)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as GeminiImageResponse;

  for (const candidate of data.candidates || []) {
    for (const part of candidate.content?.parts || []) {
      if (part.inlineData?.data) {
        return Buffer.from(part.inlineData.data, 'base64');
      }
    }
  }

  throw new Error('No image data in Gemini response');
}

// ====== Experiment Data Loading ======

interface ExperimentMeta {
  slug: string;
  title: string;
  description: string;
  subject: string;
}

async function loadExperimentMeta(slug: string): Promise<ExperimentMeta> {
  const filePath = resolve(DATA_DIR, `${slug}.ts`);
  const content = await import(filePath);

  // The export name is camelCase version of slug
  const exportName = Object.keys(content).find((k) => k !== 'default');
  if (!exportName) throw new Error(`No named export in ${filePath}`);

  const exp = content[exportName];
  return {
    slug,
    title: exp.title || slug,
    description: exp.description || exp.subtitle || '',
    subject: exp.subject || 'physics',
  };
}

// ====== Core Logic ======

function getMissingSlugs(): string[] {
  const dataSlugs = readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => f.replace('.ts', ''))
    .sort();

  const thumbnailSlugs = new Set(
    readdirSync(THUMBNAIL_DIR)
      .filter((f) => f.endsWith('.png'))
      .map((f) => f.replace('.png', ''))
  );

  return dataSlugs.filter((slug) => !thumbnailSlugs.has(slug));
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ====== CLI ======

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const isAll = args.includes('--all');
  const idIndex = args.indexOf('--id');
  const singleId = idIndex >= 0 ? args[idIndex + 1] : null;
  const delayIndex = args.indexOf('--delay');
  const delayMs = delayIndex >= 0 ? Number(args[delayIndex + 1]) * 1000 : DELAY_DEFAULT_MS;

  const missing = getMissingSlugs();

  if (isDryRun) {
    console.log(`\n📋 Missing thumbnails: ${missing.length}\n`);
    for (const slug of missing) {
      try {
        const meta = await loadExperimentMeta(slug);
        console.log(`  - ${slug} (${meta.subject}: ${meta.title})`);
      } catch {
        console.log(`  - ${slug} (⚠️ could not load metadata)`);
      }
    }
    console.log(`\nRun with --all to generate all, or --id <slug> for one.`);
    return;
  }

  const slugsToGenerate = singleId ? [singleId] : isAll ? missing : [];

  if (slugsToGenerate.length === 0) {
    console.log('Usage: --dry-run | --all | --id <slug>');
    return;
  }

  console.log(`\n🎨 Generating ${slugsToGenerate.length} thumbnail(s)...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < slugsToGenerate.length; i++) {
    const slug = slugsToGenerate[i];
    const outPath = resolve(THUMBNAIL_DIR, `${slug}.png`);

    if (existsSync(outPath)) {
      console.log(`  ⏭️  [${i + 1}/${slugsToGenerate.length}] ${slug} — already exists, skipping`);
      continue;
    }

    try {
      const meta = await loadExperimentMeta(slug);
      const prompt = buildPrompt(meta.title, meta.description, meta.subject);

      console.log(`  🔄 [${i + 1}/${slugsToGenerate.length}] ${slug} (${meta.subject}: ${meta.title})...`);

      const imageBuffer = await generateImage(prompt);
      writeFileSync(outPath, imageBuffer);

      console.log(`  ✅ ${slug} — saved (${(imageBuffer.length / 1024).toFixed(0)} KB)`);
      success++;
    } catch (err) {
      console.error(`  ❌ ${slug} — ${err instanceof Error ? err.message : err}`);
      failed++;
    }

    // Rate limit between requests
    if (i < slugsToGenerate.length - 1) {
      await sleep(delayMs);
    }
  }

  console.log(`\n📊 Done: ${success} generated, ${failed} failed, ${slugsToGenerate.length - success - failed} skipped`);
}

main().catch(console.error);
