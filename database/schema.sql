-- Apply in the Neon SQL Editor before first use. This script is idempotent.
CREATE TABLE IF NOT EXISTS cms_state (
  id TEXT PRIMARY KEY,
  draft TEXT NOT NULL,
  published TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  published_version INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS cms_revisions (
  version INTEGER PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  created_by TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS cms_media (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL,
  url TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS cms_login_guard (
  id TEXT PRIMARY KEY,
  failures INTEGER NOT NULL DEFAULT 0,
  locked_until BIGINT NOT NULL DEFAULT 0
);
