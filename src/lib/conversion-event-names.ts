export const CONVERSION_EVENT_NAMES = [
  'aeo_audit_completed',
  'aeo_audit_started',
  'aeo_lead_capture_submitted',
  'aeo_manual_audit_clicked',
  'aeo_monitor_cta_clicked',
  'aeo_page_viewed',
  'chatgpt_visibility_checker_started',
  'chatgpt_visibility_sample_report_clicked',
  'checkout_created',
  'checkout_failed',
  'full_report_checkout_clicked',
  'full_report_checkout_redirected',
  'full_report_path_clicked',
  'high_intent_primary_cta_clicked',
  'home_hero_sample_report_clicked',
  'home_tool_shortcut_clicked',
  'llms_checker_completed',
  'llms_checker_started',
  'llms_lead_capture_submitted',
  'llms_sample_report_clicked',
  'llms_to_aeo_report_clicked',
  'locked_fix_preview_seen',
  'manual_audit_checkout_failed',
  'manual_audit_checkout_redirected',
  'manual_audit_checkout_started',
  'manual_audit_page_viewed',
  'manual_audit_primary_cta_clicked',
  'manual_audit_thanks_viewed',
  'playbooks_free_scan_clicked',
  'playbooks_hero_free_scan_clicked',
  'playbooks_hero_sample_report_clicked',
  'playbooks_manual_audit_clicked',
  'playbooks_sample_report_clicked',
  'report_activated',
  'report_viewed',
  'resend_opened',
  'resend_submitted',
  'sample_report_bottom_cta_clicked',
  'sample_report_cta_clicked',
  'sample_report_run_audit_clicked',
  'scan_failed',
] as const;

const conversionEventNameSet = new Set<string>(CONVERSION_EVENT_NAMES);

export type ConversionEventName = (typeof CONVERSION_EVENT_NAMES)[number];

export function isConversionEventName(
  eventName: string
): eventName is ConversionEventName {
  return conversionEventNameSet.has(eventName);
}
