type ManualAuditNotificationOrder = {
  competitors?: string;
  email: string;
  notes?: string;
  websiteUrl: string;
};

type ManualAuditNotificationPayloadInput = {
  checkoutId?: string;
  order: ManualAuditNotificationOrder;
  orderId: string;
  submittedAt?: string;
  webhookUrl: string;
};

type GenericManualAuditNotificationPayload = {
  checkoutId: string;
  competitors: string;
  email: string;
  notes: string;
  orderId: string;
  submittedAt: string;
  type: 'manual-audit-order';
  websiteUrl: string;
};

type FeishuTextPayload = {
  msg_type: 'text';
  content: {
    text: string;
  };
};

export function buildManualAuditNotificationPayload(
  input: ManualAuditNotificationPayloadInput
): GenericManualAuditNotificationPayload | FeishuTextPayload {
  const genericPayload = buildGenericManualAuditNotificationPayload(input);

  if (isFeishuWebhookUrl(input.webhookUrl)) {
    return {
      msg_type: 'text',
      content: {
        text: buildFeishuManualAuditNotificationText(genericPayload),
      },
    };
  }

  return genericPayload;
}

function buildGenericManualAuditNotificationPayload(
  input: ManualAuditNotificationPayloadInput
): GenericManualAuditNotificationPayload {
  return {
    type: 'manual-audit-order',
    orderId: input.orderId,
    checkoutId: input.checkoutId ?? '',
    websiteUrl: input.order.websiteUrl.trim(),
    email: input.order.email.trim(),
    competitors: input.order.competitors?.trim() ?? '',
    notes: input.order.notes?.trim() ?? '',
    submittedAt: input.submittedAt ?? new Date().toISOString(),
  };
}

function buildFeishuManualAuditNotificationText(
  payload: GenericManualAuditNotificationPayload
) {
  return [
    'Manual AI Search Readiness Audit order',
    `Order ID: ${payload.orderId}`,
    payload.checkoutId ? `Checkout ID: ${payload.checkoutId}` : undefined,
    `Website: ${payload.websiteUrl}`,
    `Email: ${payload.email}`,
    payload.competitors ? `Competitors: ${payload.competitors}` : undefined,
    payload.notes ? `Notes: ${payload.notes}` : undefined,
    `Submitted: ${payload.submittedAt}`,
  ]
    .filter(Boolean)
    .join('\n');
}

function isFeishuWebhookUrl(webhookUrl: string) {
  return /(^|\.)feishu\.cn\//i.test(webhookUrl);
}
