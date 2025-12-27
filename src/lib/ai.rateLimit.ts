const AI_LIMIT = 5;
const KEY = "ai-usage";

type Usage = {
  date: string;
  count: number;
};

export function canUseAI(): boolean {
  const today = new Date().toDateString();
  const raw = localStorage.getItem(KEY);

  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify({ date: today, count: 0 }));
    return true;
  }

  const usage: Usage = JSON.parse(raw);

  if (usage.date !== today) {
    localStorage.setItem(KEY, JSON.stringify({ date: today, count: 0 }));
    return true;
  }

  return usage.count < AI_LIMIT;
}

export function incrementAI() {
  const today = new Date().toDateString();
  const usage: Usage = JSON.parse(
    localStorage.getItem(KEY) || `{ "date":"${today}", "count":0 }`
  );

  usage.count += 1;
  localStorage.setItem(KEY, JSON.stringify(usage));
}
