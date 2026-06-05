/** SM-2 spaced repetition */
export function reviewCard(card, quality) {
  const q = Math.max(0, Math.min(5, quality));
  let { ease = 2.5, interval = 0, repetitions = 0 } = card;
  if (q < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * ease);
    repetitions += 1;
    ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  }
  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;
  return { ...card, ease, interval, repetitions, nextReview, lastReview: Date.now() };
}

export function retentionScore(flashcards) {
  if (!flashcards?.length) return 0;
  const reviewed = flashcards.filter((c) => c.repetitions > 0);
  if (!reviewed.length) return 0;
  const avgEase =
    reviewed.reduce((s, c) => s + (c.ease || 2.5), 0) / reviewed.length;
  return Math.min(99, Math.round((avgEase / 2.5) * 70 + reviewed.length * 2));
}

export function dueCards(flashcards) {
  const now = Date.now();
  return (flashcards || []).filter((c) => (c.nextReview || 0) <= now);
}
