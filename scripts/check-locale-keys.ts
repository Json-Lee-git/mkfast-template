import { readFile } from 'node:fs/promises';

const JSON_MESSAGE_KEYS = [
  'auth_error_codes',
  'pricing_plans_free_features',
  'pricing_plans_free_limits',
  'pricing_plans_lifetime_features',
  'pricing_plans_lifetime_limits',
  'pricing_plans_pro_features',
  'pricing_plans_pro_limits',
] as const;

const en = await readFile('project.inlang/messages/en.json', 'utf8');
const messages = JSON.parse(en) as Record<string, string>;
const keys = Object.keys(messages).sort();
const emptyValues = keys.filter((key) => messages[key] === '');

for (const key of JSON_MESSAGE_KEYS) {
  try {
    JSON.parse(messages[key] ?? '');
  } catch {
    throw new Error(`en.${key} is not valid JSON`);
  }
}

if (emptyValues.length) {
  console.error(JSON.stringify({ emptyValues }, null, 2));
  process.exit(1);
}

console.log(`Locale keys OK (${keys.length} keys)`);
