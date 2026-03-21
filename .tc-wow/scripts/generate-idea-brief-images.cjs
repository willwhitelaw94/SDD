#!/usr/bin/env node

/**
 * Idea Brief Hero Image Generator
 *
 * Generates AI hero images for each epic's idea brief using OpenAI DALL-E API.
 * Images follow Trilogy Care branding: warm, friendly, accessible.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-xxx node generate-idea-brief-images.cjs
 *   OPENAI_API_KEY=sk-xxx node generate-idea-brief-images.cjs Budget-Reloaded
 *
 * Or set OPENAI_API_KEY in your environment.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
  model: 'dall-e-3',
  size: '1792x1024', // Landscape for hero images
  quality: 'standard', // 'standard' or 'hd'
  // Script is in .tc-wow/scripts, initiatives are in .tc-docs/content/initiatives
  initiativesDir: path.join(__dirname, '..', '..', '.tc-docs', 'content', 'initiatives'),
};

// Trilogy Care Brand Style
const TRILOGY_STYLE = `Warm, friendly illustration style with Trilogy Care branding.
Soft colors: sky blue (#1B8ECA), sage green (#10b981), cream (#fef3c7), coral accents (#f97316).
Rounded shapes. Modern but accessible healthcare setting.
Clean, professional design. No text in images.
Shows care, compassion, and technology working together.
Australian aged care context.`;

// Domain-specific visual themes
const DOMAIN_THEMES = {
  'clinical': 'healthcare setting with medical charts, care planning documents, warm lighting',
  'care': 'home care environment with elderly person receiving support, compassionate interaction',
  'consumer': 'friendly portal interface on tablet/laptop, user-centered design elements',
  'mobile': 'smartphone app in hands of elderly person or caregiver, simple intuitive interface',
  'coordinator': 'team collaboration, scheduling boards, communication tools',
  'supplier': 'delivery truck, service provider, equipment and supplies',
  'work': 'task management, workflow visualization, productivity tools',
  'budget': 'financial dashboard, budget planning, dollar signs and charts',
  'invoice': 'billing documents, payment processing, receipt and transaction icons',
  'collection': 'payment collection, direct debit, financial flow visualization',
  'adhoc': 'flexible tools, customization, feature enhancement',
};

/**
 * Extract key themes from idea brief content
 */
function extractThemes(content, epicName) {
  const themes = [];

  // Extract from problem statement
  const problemMatch = content.match(/## Problem Statement.*?\n([\s\S]*?)(?=\n##|$)/);
  if (problemMatch) {
    const problem = problemMatch[1].toLowerCase();

    // Look for key concepts
    if (problem.includes('budget') || problem.includes('funding')) themes.push('budget management');
    if (problem.includes('invoice') || problem.includes('bill')) themes.push('invoice processing');
    if (problem.includes('mobile') || problem.includes('app')) themes.push('mobile application');
    if (problem.includes('supplier') || problem.includes('provider')) themes.push('supplier management');
    if (problem.includes('care plan') || problem.includes('clinical')) themes.push('care planning');
    if (problem.includes('coordinator')) themes.push('care coordination');
    if (problem.includes('consumer') || problem.includes('recipient')) themes.push('consumer portal');
    if (problem.includes('onboard') || problem.includes('sign')) themes.push('digital onboarding');
    if (problem.includes('report') || problem.includes('dashboard')) themes.push('reporting dashboard');
    if (problem.includes('booking') || problem.includes('schedule')) themes.push('service scheduling');
  }

  // Add domain theme based on folder path
  const epicNameLower = epicName.toLowerCase();
  for (const [domain, theme] of Object.entries(DOMAIN_THEMES)) {
    if (epicNameLower.includes(domain)) {
      themes.push(theme);
      break;
    }
  }

  return themes.length > 0 ? themes : ['healthcare technology', 'aged care services'];
}

/**
 * Generate a visual prompt for the idea brief
 */
function generatePrompt(epicName, content, initiativeName) {
  const themes = extractThemes(content, epicName);
  const themeDescription = themes.slice(0, 3).join(', ');

  // Create a descriptive title from the epic name
  const humanTitle = epicName
    .replace(/-/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim();

  const prompt = `${TRILOGY_STYLE}

Scene: Modern Australian aged care environment depicting "${humanTitle}".
Visual elements: ${themeDescription}.
Composition: Wide landscape showing technology empowering elderly care.
Include: Friendly elderly person, modern devices, care environment.
Mood: Optimistic, professional, warm, supportive.
Style: Flat illustration with subtle gradients, clean lines, contemporary healthcare aesthetic.`;

  return prompt;
}

/**
 * Find all idea briefs
 */
function findIdeaBriefs(targetEpic = null) {
  const briefs = [];

  function scanDirectory(dir, initiative = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        // Skip context folders
        if (item.name === 'context' || item.name === 'subepics') continue;

        // Check if this is an initiative folder (has meta.yaml)
        const metaPath = path.join(fullPath, 'meta.yaml');
        if (fs.existsSync(metaPath) && !initiative) {
          scanDirectory(fullPath, item.name);
        } else if (initiative) {
          // This might be an epic folder
          const ideaBriefPath = path.join(fullPath, 'IDEA-BRIEF.md');
          if (fs.existsSync(ideaBriefPath)) {
            // Check if target specified
            if (targetEpic && item.name !== targetEpic) continue;

            briefs.push({
              epicName: item.name,
              initiative: initiative,
              ideaBriefPath: ideaBriefPath,
              epicDir: fullPath,
            });
          }
        }
      }
    }
  }

  scanDirectory(CONFIG.initiativesDir);
  return briefs;
}

async function generateImage(prompt, outputPath) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const requestData = JSON.stringify({
    model: CONFIG.model,
    prompt: prompt,
    n: 1,
    size: CONFIG.size,
    quality: CONFIG.quality,
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(requestData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(response.error.message));
            return;
          }
          const imageUrl = response.data[0].url;
          downloadImage(imageUrl, outputPath)
            .then(resolve)
            .catch(reject);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(requestData);
    req.end();
  });
}

function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete partial file
      reject(err);
    });
  });
}

async function main() {
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable is required');
    console.error('');
    console.error('Usage:');
    console.error('  OPENAI_API_KEY=sk-xxx node generate-idea-brief-images.cjs');
    console.error('  OPENAI_API_KEY=sk-xxx node generate-idea-brief-images.cjs Epic-Name');
    console.error('');
    console.error('Or export the key:');
    console.error('  export OPENAI_API_KEY=sk-xxx');
    console.error('  node generate-idea-brief-images.cjs');
    process.exit(1);
  }

  // Parse command line args for specific epic
  const targetEpic = process.argv[2];

  // Find all idea briefs
  const briefs = findIdeaBriefs(targetEpic);

  if (briefs.length === 0) {
    if (targetEpic) {
      console.error(`❌ No idea brief found for epic: ${targetEpic}`);
    } else {
      console.error('❌ No idea briefs found');
    }
    process.exit(1);
  }

  console.log('🎨 Idea Brief Hero Image Generator');
  console.log('===================================');
  console.log(`🖼️  Epics to process: ${briefs.length}`);
  console.log(`💰 Estimated cost: ~$${(briefs.length * 0.04).toFixed(2)} (DALL-E 3 standard)`);
  console.log('');

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const brief of briefs) {
    const outputPath = path.join(brief.epicDir, 'hero.png');

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  ${brief.initiative}/${brief.epicName} (hero.png exists)`);
      skipped++;
      continue;
    }

    process.stdout.write(`🔄 ${brief.initiative}/${brief.epicName}...`);

    try {
      // Read idea brief content
      const content = fs.readFileSync(brief.ideaBriefPath, 'utf8');

      // Generate prompt
      const prompt = generatePrompt(brief.epicName, content, brief.initiative);

      // Generate image
      await generateImage(prompt, outputPath);
      console.log(' ✅');
      generated++;

      // Rate limiting - wait 2 seconds between requests
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.log(` ❌ ${error.message}`);
      failed++;
    }
  }

  console.log('\n===================================');
  console.log(`✅ Generated: ${generated}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  if (failed > 0) console.log(`❌ Failed: ${failed}`);
}

main().catch(console.error);
