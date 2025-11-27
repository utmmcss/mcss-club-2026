CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  event_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reminder_scheduled_for TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ,
  last_notified_at TIMESTAMPTZ
);

-- Ensure a single subscription per email+event
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_email_event
  ON subscriptions (email, event_id);

-- Speed up due-reminder queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_reminder_scheduled_for
  ON subscriptions (reminder_scheduled_for);
