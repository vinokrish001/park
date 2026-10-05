import { Router, Request, Response } from 'express';
import { EmployeeService } from './employee.service';

export class EmployeeController {
  router = Router();

  constructor(private service: EmployeeService) {
    this.router.get('/', (req, res) => this.findAll(req, res));
    this.router.get('/:id', (req, res) => this.findOne(req, res));
    this.router.post('/', (req, res) => this.create(req, res));
    this.router.put('/:id', (req, res) => this.update(req, res));
    this.router.delete('/:id', (req, res) => this.remove(req, res));
  }

  async findAll(req: Request, res: Response) {
    try {
      const search = String(req.query.search || '').trim();
      const department = String(req.query.department || '').trim();
      const page = Math.max(parseInt(String(req.query.page), 10) || 1, 1);
      const limit = Math.max(parseInt(String(req.query.limit), 10) || 6, 1);
      const data = await this.service.findAll(search, department, page, limit);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch employees' });
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const row = await this.service.findOne(Number(req.params.id));
      if (!row) return res.status(404).json({ message: 'Not found' });
      res.json(row);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch employee' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const row = await this.service.create(req.body);
      res.status(201).json(row);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to add employee' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const row = await this.service.update(Number(req.params.id), req.body);
      if (!row) return res.status(404).json({ message: 'Not found' });
      res.json(row);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update employee' });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const ok = await this.service.remove(Number(req.params.id));
      if (!ok) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to delete employee' });
    }
  }
}
