import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  generateGrowthAssetMarkdown,
  slugifyTarget,
  type GrowthTarget,
} from './lib/growth-asset-generator.ts';

type CampaignConfig = {
  productName?: string;
  primaryCta?: string;
  targets: GrowthTarget[];
};

const projectRoot = process.cwd();
const configPath = path.join(
  projectRoot,
  'docs/growth/acquisition-targets.json'
);
const outputDir = path.join(projectRoot, 'docs/growth/generated');

async function main() {
  const rawConfig = await readFile(configPath, 'utf8');
  const config = JSON.parse(rawConfig) as CampaignConfig;

  if (!Array.isArray(config.targets) || config.targets.length === 0) {
    throw new Error(
      'docs/growth/acquisition-targets.json must include at least one target'
    );
  }

  await mkdir(outputDir, { recursive: true });

  const writtenFiles: string[] = [];
  for (const target of config.targets) {
    const slug = slugifyTarget(target.keyword);
    const markdown = generateGrowthAssetMarkdown(target, {
      productName: config.productName,
      primaryCta: config.primaryCta,
    });
    const filePath = path.join(outputDir, `${slug}.md`);
    await writeFile(filePath, markdown, 'utf8');
    writtenFiles.push(path.relative(projectRoot, filePath));
  }

  console.log(`Generated ${writtenFiles.length} growth asset(s):`);
  for (const file of writtenFiles) {
    console.log(`- ${file}`);
  }
}

await main();
