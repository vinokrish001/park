const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

const cols = `id, full_name, email, role, department, status, to_char(start_date, 'YYYY-MM-DD') as start_date, manager`;

// list + search + department filter + pagination
app.get('/api/employees', async (req, res) => {
  try {
    const search = (req.query.search || '').trim();
    const department = (req.query.department || '').trim();
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 6, 1);
    const offset = (page - 1) * limit;

    const where = [];
    const values = [];

    if (search) {
      values.push('%' + search + '%');
      where.push('(full_name ILIKE $' + values.length + ' OR email ILIKE $' + values.length + ' OR role ILIKE $' + values.length + ')');
    }
    if (department) {
      values.push(department);
      where.push('department = $' + values.length);
    }

    const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const count = await pool.query('SELECT COUNT(*) FROM employees ' + whereSql, values);

    values.push(limit);
    values.push(offset);
    const list = await pool.query(
      'SELECT ' + cols + ' FROM employees ' + whereSql + ' ORDER BY id ASC LIMIT $' + (values.length - 1) + ' OFFSET $' + values.length,
      values
    );

    res.json({
      data: list.rows,
      total: parseInt(count.rows[0].count),
      page,
      limit
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT ' + cols + ' FROM employees WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch employee' });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { full_name, email, role, department, status, start_date, manager } = req.body;
    const result = await pool.query(
      `INSERT INTO employees (full_name, email, role, department, status, start_date, manager)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING ` + cols,
      [full_name, email, role, department, status || 'Active', start_date, manager || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add employee' });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { full_name, email, role, department, status, start_date, manager } = req.body;
    const result = await pool.query(
      `UPDATE employees SET full_name=$1, email=$2, role=$3, department=$4, status=$5, start_date=$6, manager=$7
       WHERE id=$8 RETURNING ` + cols,
      [full_name, email, role, department, status, start_date, manager || null, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update employee' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete employee' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('emp-api running on ' + port));
