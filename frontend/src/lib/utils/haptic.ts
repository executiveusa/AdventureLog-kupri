/**
 * Haptic feedback utility — wraps navigator.vibrate() safely.
 * Silently no-ops on desktop or unsupported browsers.
 */

function canVibrate(): boolean {
  return typeof window !== 'undefined' && 'vibrate' in navigator;
}

/** Light tap — buttons, selections */
export function hapticTap(): void {
  if (canVibrate()) navigator.vibrate(10);
}

/** Medium click — nav, tab switches */
export function hapticClick(): void {
  if (canVibrate()) navigator.vibrate(20);
}

/** Success — unlock, confetti */
export function hapticSuccess(): void {
  if (canVibrate()) navigator.vibrate([10, 50, 20]);
}

/** Error — wrong password, fail */
export function hapticError(): void {
  if (canVibrate()) navigator.vibrate([30, 20, 30, 20, 60]);
}

/** Heavy — scroll milestone, section entrance */
export function hapticHeavy(): void {
  if (canVibrate()) navigator.vibrate(40);
}
