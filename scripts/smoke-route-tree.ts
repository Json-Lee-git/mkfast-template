import { readFileSync } from 'node:fs';

type CheckResult = {
  name: string;
  ok: boolean;
  detail: string;
};

const routeTree = readFileSync('src/routeTree.gen.ts', 'utf8');
const results: CheckResult[] = [];

function pass(name: string, detail: string) {
  results.push({ name, ok: true, detail });
}

function fail(name: string, detail: string) {
  results.push({ name, ok: false, detail });
}

function checkThanksRouteParent() {
  const updateMatch = routeTree.match(
    /const AiSearchAuditThanksRoute = AiSearchAuditThanksRouteImport\.update\(\{[\s\S]*?getParentRoute: \(\) => ([^,\n]+)/
  );

  if (!updateMatch) {
    fail('thanks route parent', 'could not find generated route update block');
    return;
  }

  const parent = updateMatch[1]?.trim();
  if (parent === 'rootRouteImport') {
    pass('thanks route parent', 'rootRouteImport');
  } else {
    fail(
      'thanks route parent',
      `expected rootRouteImport, got ${parent ?? 'unknown'}`
    );
  }
}

checkThanksRouteParent();

const failed = results.filter((result) => !result.ok);
for (const result of results) {
  console.log(
    `${result.ok ? 'PASS' : 'FAIL'} ${result.name}: ${result.detail}`
  );
}

if (failed.length > 0) {
  console.error(`\n${failed.length} route-tree smoke check(s) failed`);
  process.exitCode = 1;
} else {
  console.log(`\nAll ${results.length} route-tree smoke checks passed`);
}
