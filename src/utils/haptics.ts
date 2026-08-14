/**
 * Mobile Web Vibration / Haptic Feedback utility
 */
export function triggerHaptic(type: 'slide' | 'victory' | 'error' | 'click' = 'slide') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

  try {
    switch (type) {
      case 'slide':
        navigator.vibrate(15); // 15ms subtle tap
        break;
      case 'click':
        navigator.vibrate(10);
        break;
      case 'victory':
        navigator.vibrate([40, 60, 80]); // 3-step celebratory pulse
        break;
      case 'error':
        navigator.vibrate([50, 40, 50]);
        break;
    }
  } catch {
    // Ignore unsupported/blocked devices
  }
}
