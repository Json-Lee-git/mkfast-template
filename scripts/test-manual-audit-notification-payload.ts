import assert from 'node:assert/strict';
import { buildManualAuditNotificationPayload } from '../src/api/ai-readiness/manual-audit-notification';

const order = {
  websiteUrl: 'https://example.com/manual-audit-smoke',
  email: 'ops+manual-audit-smoke@example.com',
  competitors: 'competitor.example',
  notes: 'Please include ChatGPT and Perplexity checks.',
};

const feishuPayload = buildManualAuditNotificationPayload({
  webhookUrl: 'https://open.feishu.cn/open-apis/bot/v2/hook/test',
  orderId: 'ord_smoke',
  checkoutId: 'chk_smoke',
  order,
  submittedAt: '2026-07-02T16:00:00.000Z',
});

assert.equal('msg_type' in feishuPayload, true);
if (!('msg_type' in feishuPayload)) {
  throw new Error('Expected Feishu notification payload');
}
assert.equal(feishuPayload.msg_type, 'text');
assert.match(
  feishuPayload.content.text,
  /Manual AI Search Readiness Audit order/
);
assert.match(feishuPayload.content.text, /ord_smoke/);
assert.match(
  feishuPayload.content.text,
  /https:\/\/example.com\/manual-audit-smoke/
);
assert.match(feishuPayload.content.text, /ops\+manual-audit-smoke@example.com/);

const genericPayload = buildManualAuditNotificationPayload({
  webhookUrl: 'https://example.com/webhook',
  orderId: 'ord_smoke',
  checkoutId: 'chk_smoke',
  order,
  submittedAt: '2026-07-02T16:00:00.000Z',
});

assert.deepEqual(genericPayload, {
  type: 'manual-audit-order',
  orderId: 'ord_smoke',
  checkoutId: 'chk_smoke',
  websiteUrl: 'https://example.com/manual-audit-smoke',
  email: 'ops+manual-audit-smoke@example.com',
  competitors: 'competitor.example',
  notes: 'Please include ChatGPT and Perplexity checks.',
  submittedAt: '2026-07-02T16:00:00.000Z',
});

console.log('manual audit notification payload tests passed');
