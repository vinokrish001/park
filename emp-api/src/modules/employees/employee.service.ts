import { pool } from '../../database/database';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

const cols = `id, full_name, email, role, department, status, to_char(start_date, 'YYYY-MM-DD') as start_date, manager`;

export class EmployeeService {
  async findAll(search: string, department: string, page: number, limit: number) {
    const where: string[] = [];
    const values: unknown[] = [];

    if (search) {
      values.push('%' + search + '%');
      where.push(
        '(full_name ILIKE $' + values.length + ' OR email ILIKE $' + values.length + ' OR role ILIKE $' + values.length + ')'
      );
    }
    if (department) {
      values.push(department);
      where.push('department = $' + values.length);
    }

    const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const count = await pool.query('SELECT COUNT(*) FROM employees ' + whereSql, values);

    values.push(limit);
    values.push((page - 1) * limit);
    const list = await pool.query(
      'SELECT ' + cols + ' FROM employees ' + whereSql + ' ORDER BY id ASC LIMIT $' + (values.length - 1) + ' OFFSET $' + values.length,
      values
    );

    return {
      data: list.rows as Employee[],
      total: parseInt(count.rows[0].count, 10),
      page,
      limit
    };
  }

  async findOne(id: number) {
    const result = await pool.query('SELECT ' + cols + ' FROM employees WHERE id = $1', [id]);
    return (result.rows[0] as Employee) || null;
  }

  async create(body: CreateEmployeeDto) {
    const result = await pool.query(
      `INSERT INTO employees (full_name, email, role, department, status, start_date, manager)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING ` + cols,
      [
        body.full_name,
        body.email,
        body.role,
        body.department,
        body.status || 'Active',
        body.start_date,
        body.manager || null
      ]
    );
    return result.rows[0] as Employee;
  }

  async update(id: number, body: UpdateEmployeeDto) {
    const result = await pool.query(
      `UPDATE employees SET full_name=$1, email=$2, role=$3, department=$4, status=$5, start_date=$6, manager=$7
       WHERE id=$8 RETURNING ` + cols,
      [
        body.full_name,
        body.email,
        body.role,
        body.department,
        body.status,
        body.start_date,
        body.manager || null,
        id
      ]
    );
    return (result.rows[0] as Employee) || null;
  }

  async remove(id: number) {
    const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }
}
