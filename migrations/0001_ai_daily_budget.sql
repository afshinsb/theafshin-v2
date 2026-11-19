CREATE TABLE IF NOT EXISTS ai_daily_budget (
  day TEXT PRIMARY KEY,
  used INTEGER NOT NULL CHECK (used > 0)
);
