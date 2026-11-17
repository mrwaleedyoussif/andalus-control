"""Storage: one SQLite file, created on first use. Nothing else in the system talks to the database directly."""
import sqlite3

SCHEMA = """
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, level TEXT NOT NULL,
  stages TEXT NOT NULL DEFAULT '[]', aliases TEXT NOT NULL DEFAULT '[]', phone TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1, token_hash TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS indicators (
  id INTEGER PRIMARY KEY, source TEXT NOT NULL, code TEXT NOT NULL, name TEXT NOT NULL, stage TEXT NOT NULL,
  owner_text TEXT NOT NULL DEFAULT '', UNIQUE (source, code, stage));
CREATE TABLE IF NOT EXISTS programmes (
  id INTEGER PRIMARY KEY, key TEXT NOT NULL UNIQUE, source TEXT NOT NULL, stage TEXT NOT NULL, code TEXT NOT NULL,
  name TEXT NOT NULL, details TEXT NOT NULL DEFAULT '', term INTEGER, week INTEGER,
  start TEXT NOT NULL DEFAULT '', "end" TEXT NOT NULL DEFAULT '', dated INTEGER NOT NULL DEFAULT 0,
  executor_text TEXT NOT NULL DEFAULT '', budget REAL NOT NULL DEFAULT 0, approved INTEGER NOT NULL DEFAULT 0,
  done INTEGER NOT NULL DEFAULT 0, evidence TEXT NOT NULL DEFAULT '', comment TEXT NOT NULL DEFAULT '',
  position TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS assignments (
  programme_key TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), by_user INTEGER NOT NULL, at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY, programme_key TEXT NOT NULL, by_user INTEGER NOT NULL REFERENCES users(id),
  outcome TEXT NOT NULL, note TEXT NOT NULL DEFAULT '', evidence TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'pending',
  decided_by INTEGER, decided_at TEXT NOT NULL DEFAULT '', decision_note TEXT NOT NULL DEFAULT '', at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS dev_items (
  id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), kind TEXT NOT NULL, title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo', due TEXT NOT NULL DEFAULT '', note TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'manual', by_user INTEGER NOT NULL, at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS alerts_sent (
  day TEXT NOT NULL, user_id INTEGER NOT NULL, rule TEXT NOT NULL, programme_key TEXT NOT NULL,
  PRIMARY KEY (day, user_id, rule, programme_key));
CREATE TABLE IF NOT EXISTS outbox (
  id INTEGER PRIMARY KEY, at TEXT NOT NULL, user_id INTEGER NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL,
  delivered INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS audit (
  id INTEGER PRIMARY KEY, at TEXT NOT NULL, user_email TEXT NOT NULL, action TEXT NOT NULL, target TEXT NOT NULL DEFAULT '',
  detail TEXT NOT NULL DEFAULT '');
"""

TABLES = ['settings', 'users', 'indicators', 'programmes', 'assignments', 'reports', 'dev_items', 'alerts_sent', 'outbox', 'audit']


def connect(path):
    """Opens the database file (':memory:' for a throwaway one) and makes sure every table exists."""
    con = sqlite3.connect(path)
    con.row_factory = sqlite3.Row
    con.execute('PRAGMA foreign_keys = ON')
    con.executescript(SCHEMA)
    con.commit()
    return con
