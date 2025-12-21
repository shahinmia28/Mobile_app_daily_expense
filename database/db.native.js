import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('dailyExpense.db');

/* ========== INIT DB ========== */
export const initDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reason TEXT,
      amount REAL,
      date TEXT
    );

    CREATE TABLE IF NOT EXISTS incomes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reason TEXT,
      amount REAL,
      date TEXT
    );
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      pinned INTEGER DEFAULT 0,
      createdAt TEXT,
      updatedAt TEXT
    );

  `);
  // 🟡 MIGRATION (safe)
  try {
    await db.execAsync(
      `ALTER TABLE notes ADD COLUMN pinned INTEGER DEFAULT 0;`
    );
  } catch {}
  try {
    await db.execAsync(`ALTER TABLE notes ADD COLUMN updatedAt TEXT;`);
  } catch {}

  console.log('DB initialized');
};

/* ========== EXPENSE ========== */
export const getAllExpenses = async () => {
  return await db.getAllAsync('SELECT * FROM expenses ORDER BY date DESC;');
};

export const insertExpense = async ({ reason, amount, date }) => {
  return await db.runAsync(
    'INSERT INTO expenses (reason, amount, date) VALUES (?, ?, ?);',
    [reason, amount, date]
  );
};
export const updateExpense = async ({ id, reason, amount, date }) => {
  return await db.runAsync(
    'UPDATE expenses SET reason=?, amount=?, date=? WHERE id=?;',
    [reason, amount, date, id]
  );
};

export const deleteExpenseById = async (id) => {
  return await db.runAsync('DELETE FROM expenses WHERE id = ?;', [id]);
};

/* ========== INCOME ========== */
export const getAllIncomes = async () => {
  return await db.getAllAsync('SELECT * FROM incomes ORDER BY date DESC;');
};

export const insertIncome = async ({ reason, amount, date }) => {
  return await db.runAsync(
    'INSERT INTO incomes (reason, amount, date) VALUES (?, ?, ?);',
    [reason, amount, date]
  );
};

export const deleteIncomeById = async (id) => {
  return await db.runAsync('DELETE FROM incomes WHERE id = ?;', [id]);
};

export const updateIncome = async ({ id, reason, amount, date }) => {
  return await db.runAsync(
    'UPDATE incomes SET reason=?, amount=?, date=? WHERE id=?;',
    [reason, amount, date, id]
  );
};
// notes
// notes
export const getAllNotes = async () => {
  return await db.getAllAsync(`
    SELECT * FROM notes
    ORDER BY pinned DESC, datetime(updatedAt) DESC, datetime(createdAt) DESC;
  `);
};

export const insertNote = async ({
  title,
  content,
  pinned,
  createdAt,
  updatedAt,
}) => {
  return await db.runAsync(
    `
    INSERT INTO notes (title, content, pinned, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?);
  `,
    [title, content, pinned, createdAt, updatedAt]
  );
};

export const updateNote = async ({ id, title, content, pinned, updatedAt }) => {
  return await db.runAsync(
    `
    UPDATE notes
    SET title=?, content=?, pinned=?, updatedAt=?
    WHERE id=?;
  `,
    [title, content, pinned, updatedAt, id]
  );
};

export const deleteNoteById = async (id) => {
  return await db.runAsync('DELETE FROM notes WHERE id=?;', [id]);
};

export default db;
