import confetti from 'canvas-confetti';

/**
 * Triggers a celebration burst with celebratory sound and particle physics
 */
export function triggerMilestoneConfetti(tier: 7 | 30 | 100 | 365 = 7) {
  // Color themes based on milestone flame tier
  const colors = {
    7: ['#F59E0B', '#FBBF24', '#10B981', '#34D399', '#3B82F6'], // Bronze / Emerald
    30: ['#E0E7FF', '#6366F1', '#818CF8', '#EC4899', '#A855F7'], // Silver / Indigo / Purple
    100: ['#F59E0B', '#FCD34D', '#EF4444', '#EC4899', '#F97316'], // Golden / Flame
    365: ['#FFD700', '#FF69B4', '#00FFFF', '#FF4500', '#7C3AED'], // Diamond / Cosmic
  }[tier];

  // First burst from center
  confetti({
    particleCount: tier >= 100 ? 120 : 70,
    spread: 70,
    origin: { y: 0.6 },
    colors: colors,
    disableForReducedMotion: true,
  });

  // Secondary side cannons for bigger milestones
  if (tier >= 30) {
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });
    }, 200);
  }
}

/**
 * Play a subtle pleasant chime when habit is checked off
 */
export function playCheckSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Happy chime: quick jump from 520Hz (C5) to 659Hz (E5)
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(784, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {
    // AudioContext might be blocked or unsupported; silent fallback is fine
  }
}
