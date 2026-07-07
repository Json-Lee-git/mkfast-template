type ParsedWebhookPayload = {
  id?: unknown;
};

export function shouldExposeManualAuditSmokeErrorDetail(
  raw: ParsedWebhookPayload | undefined
) {
  return (
    optionalString(raw?.id)?.startsWith('evt_manual_audit_smoke_') ?? false
  );
}

export function formatWebhookErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function optionalString(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}
