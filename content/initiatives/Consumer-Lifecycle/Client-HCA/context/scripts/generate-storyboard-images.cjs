#!/usr/bin/env node

/**
 * Storyboard Image Generator
 *
 * Generates AI images from storyboard prompts using OpenAI DALL-E API.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-xxx node generate-storyboard-images.js
 *
 * Or set OPENAI_API_KEY in your environment.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
  model: 'dall-e-3',
  size: '1792x1024', // Landscape for storyboard panels
  quality: 'standard', // 'standard' or 'hd'
  outputDir: path.join(__dirname, '..', 'images', 'storyboards'),
};

// Storyboard prompts extracted from storyboards.md
const STORYBOARDS = {
  'US01': {
    title: 'First-Login Signing Flow',
    panels: [
      {
        id: 'US01-P1',
        scene: 'Email arrives',
        prompt: 'Warm illustration, cozy kitchen with morning light. Elderly woman with silver curly hair and glasses sitting at wooden table, looking at open laptop with curious, hopeful expression. Small envelope icon floating near screen. Soft blue and cream colors. Friendly cartoon style.'
      },
      {
        id: 'US01-P2',
        scene: 'Click magic link',
        prompt: 'Simple illustration of elderly woman\'s hand with finger hovering over laptop trackpad, about to click. Screen shows glowing blue button. Warm lighting. Close-up composition. Soft, encouraging mood.'
      },
      {
        id: 'US01-P3',
        scene: 'Portal opens',
        prompt: 'Warm illustration of elderly woman with glasses looking at laptop screen, expression changing to understanding and relief. Soft glow from screen illuminates her face. Clean, modern interface suggested on screen. Cozy home office setting.'
      },
      {
        id: 'US01-P4',
        scene: 'Signs agreement',
        prompt: 'Friendly illustration of elderly woman using finger on tablet screen to draw signature, focused but confident expression. Signature line visible on screen. Warm afternoon light. Achievement moment.'
      },
      {
        id: 'US01-P5',
        scene: 'Success!',
        prompt: 'Joyful illustration of elderly woman with hands clasped together, relieved and happy smile, looking at laptop showing green checkmark. Subtle confetti or sparkles. Warm, celebratory mood. Mission accomplished feeling.'
      }
    ]
  },
  'US02': {
    title: 'Digital Signature',
    panels: [
      {
        id: 'US02-P1',
        scene: 'Opens on phone',
        prompt: 'Warm illustration of middle-aged man in casual business clothes sitting on comfortable couch, holding smartphone, focused but caring expression. Evening living room setting with soft lamp light. Modern, relatable scene.'
      },
      {
        id: 'US02-P2',
        scene: 'Reviews terms',
        prompt: 'Close-up illustration of hands holding smartphone, thumb scrolling through document on screen. Clean UI suggested. Soft focus background. Thoughtful, careful mood.'
      },
      {
        id: 'US02-P3',
        scene: 'Confirms details',
        prompt: 'Illustration of man looking at phone screen intently, finger about to tap. Expression of careful consideration. Warm lighting. Responsible decision moment.'
      },
      {
        id: 'US02-P4',
        scene: 'Draws signature',
        prompt: 'Close-up illustration of finger drawing signature on smartphone touchscreen. Signature trail visible. Clean white screen. Focused, deliberate action.'
      },
      {
        id: 'US02-P5',
        scene: 'Done!',
        prompt: 'Warm illustration of middle-aged man leaning back with relieved smile, phone showing green checkmark. Weight lifted feeling. Cozy evening atmosphere.'
      }
    ]
  },
  'US05': {
    title: 'Draft to Sent (Staff View)',
    panels: [
      {
        id: 'US05-P1',
        scene: 'Assessment meeting',
        prompt: 'Warm illustration of female healthcare coordinator in professional casual clothes sitting with elderly woman in cozy living room. Tablet visible. Friendly conversation, supportive atmosphere. Soft natural light.'
      },
      {
        id: 'US05-P2',
        scene: 'Reviews draft',
        prompt: 'Illustration of coordinator looking at tablet screen showing document with watermark overlay suggested. Thoughtful, reviewing expression. Professional but warm.'
      },
      {
        id: 'US05-P3',
        scene: 'Marks complete',
        prompt: 'Close-up of coordinator\'s hand tapping toggle switch on tablet. Clean interface. Satisfying action moment. Progress being made.'
      },
      {
        id: 'US05-P4',
        scene: 'Sends agreement',
        prompt: 'Illustration of coordinator with confident smile, finger pressing send button on tablet. Small paper airplane or send icon floating up. Achievement moment.'
      },
      {
        id: 'US05-P5',
        scene: 'Client notified',
        prompt: 'Split illustration: left side shows coordinator with satisfied expression, right side shows elderly woman receiving notification on phone. Connected feeling. Warm colors both sides.'
      }
    ]
  },
  'US06-US07': {
    title: 'Alternative Consent (Staff)',
    panels: [
      {
        id: 'US06-P1',
        scene: 'Verbal consent',
        prompt: 'Warm illustration of office worker on phone headset, writing notes, friendly professional expression. Modern office with soft lighting. Active listening pose.'
      },
      {
        id: 'US06-P2',
        scene: 'Records details',
        prompt: 'Close-up of hands typing on keyboard, screen showing form with text fields. Clean, organized data entry. Careful documentation mood.'
      },
      {
        id: 'US06-P3',
        scene: 'Captures consent',
        prompt: 'Illustration of staff member with satisfied nod, screen showing green success confirmation. Job well done feeling.'
      },
      {
        id: 'US07-P1',
        scene: 'Paper signed',
        prompt: 'Illustration of elderly person handing signed document to coordinator in home setting. Paper has signature visible. Helpful exchange moment.'
      },
      {
        id: 'US07-P2',
        scene: 'Uploads PDF',
        prompt: 'Illustration of coordinator at desk, dragging document icon toward computer screen. Upload progress suggested. Modern office setting.'
      },
      {
        id: 'US07-P3',
        scene: 'Complete',
        prompt: 'Illustration showing document thumbnail with green checkmark badge. Clean, organized file view. Archived and secure feeling.'
      }
    ]
  },
  'US09': {
    title: 'SLA Reminders',
    panels: [
      {
        id: 'US09-P1',
        scene: 'Day 1',
        prompt: 'Illustration of clock showing time passing, small envelope icon floating nearby. Gentle, not urgent mood. Soft blue tones. Helpful reminder concept.'
      },
      {
        id: 'US09-P2',
        scene: 'Day 2',
        prompt: 'Illustration of elderly woman at kitchen table, slightly overwhelmed expression, multiple small envelope icons floating. Busy life feeling. Warm but slightly urgent.'
      },
      {
        id: 'US09-P3',
        scene: 'Day 7',
        prompt: 'Illustration of smartphone on table with notification badge glowing. Elderly woman noticing it with "oh right" expression. Gentle reminder moment.'
      },
      {
        id: 'US09-P4',
        scene: 'Signs!',
        prompt: 'Illustration of elderly woman finally signing on tablet, determined and relieved expression. Getting it done feeling. Warm accomplishment.'
      },
      {
        id: 'US09-P5',
        scene: 'Reminders stop',
        prompt: 'Peaceful illustration of elderly woman with content smile, crossed-out notification icons fading away. Peace and completion. Serene mood.'
      }
    ]
  },
  'US10-US15': {
    title: 'Termination',
    panels: [
      {
        id: 'US10-P1',
        scene: 'Life change',
        prompt: 'Bittersweet illustration of elderly woman with family members, suitcase nearby, looking hopeful but nostalgic. Life transition moment. Warm but poignant.'
      },
      {
        id: 'US10-P2',
        scene: 'Staff action',
        prompt: 'Illustration of coordinator at desk, selecting option from dropdown menu on screen. Professional, respectful action. Careful and considerate mood.'
      },
      {
        id: 'US10-P3',
        scene: 'Sets end date',
        prompt: 'Close-up of calendar interface on screen with date being selected. Clean, organized. Thoughtful planning moment.'
      },
      {
        id: 'US10-P4',
        scene: 'Notifications',
        prompt: 'Illustration showing multiple email icons spreading outward to different people icons. Communication ripple effect. Professional and thorough.'
      },
      {
        id: 'US10-P5',
        scene: 'History preserved',
        prompt: 'Warm illustration of archive folder with documents safely stored, gentle glow around it. History preserved feeling. Respectful closure.'
      }
    ]
  }
};

// Style prefix to prepend to all prompts for consistency
const STYLE_PREFIX = 'Warm, friendly illustration style. Soft colors (sky blue, sage green, cream, coral accents). Rounded shapes. Modern but accessible. No text in images. ';

async function generateImage(prompt, outputPath) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const fullPrompt = STYLE_PREFIX + prompt;

  const requestData = JSON.stringify({
    model: CONFIG.model,
    prompt: fullPrompt,
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
    console.error('  OPENAI_API_KEY=sk-xxx node generate-storyboard-images.js');
    console.error('');
    console.error('Or export the key:');
    console.error('  export OPENAI_API_KEY=sk-xxx');
    console.error('  node generate-storyboard-images.js');
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  // Parse command line args for specific story
  const targetStory = process.argv[2]; // e.g., "US01" or "all"

  const storiesToGenerate = targetStory && targetStory !== 'all'
    ? { [targetStory]: STORYBOARDS[targetStory] }
    : STORYBOARDS;

  if (targetStory && !STORYBOARDS[targetStory] && targetStory !== 'all') {
    console.error(`❌ Unknown story: ${targetStory}`);
    console.error(`Available stories: ${Object.keys(STORYBOARDS).join(', ')}`);
    process.exit(1);
  }

  // Count total panels
  const totalPanels = Object.values(storiesToGenerate)
    .reduce((sum, story) => sum + story.panels.length, 0);

  console.log('🎨 Storyboard Image Generator');
  console.log('============================');
  console.log(`📁 Output: ${CONFIG.outputDir}`);
  console.log(`🖼️  Panels to generate: ${totalPanels}`);
  console.log(`💰 Estimated cost: ~$${(totalPanels * 0.04).toFixed(2)} (DALL-E 3 standard)`);
  console.log('');

  let generated = 0;
  let failed = 0;

  for (const [storyId, story] of Object.entries(storiesToGenerate)) {
    console.log(`\n📖 ${storyId}: ${story.title}`);

    for (const panel of story.panels) {
      const filename = `${panel.id}.png`;
      const outputPath = path.join(CONFIG.outputDir, filename);

      // Skip if already exists
      if (fs.existsSync(outputPath)) {
        console.log(`  ⏭️  ${panel.id} - ${panel.scene} (already exists)`);
        continue;
      }

      process.stdout.write(`  🔄 ${panel.id} - ${panel.scene}...`);

      try {
        await generateImage(panel.prompt, outputPath);
        console.log(' ✅');
        generated++;

        // Rate limiting - wait 1 second between requests
        await new Promise(r => setTimeout(r, 1000));
      } catch (error) {
        console.log(` ❌ ${error.message}`);
        failed++;
      }
    }
  }

  console.log('\n============================');
  console.log(`✅ Generated: ${generated}`);
  if (failed > 0) console.log(`❌ Failed: ${failed}`);
  console.log(`📁 Images saved to: ${CONFIG.outputDir}`);
}

main().catch(console.error);
