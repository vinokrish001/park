import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerEmployeeModule } from './modules/employees/employee.module';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

registerEmployeeModule(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('emp-api running on ' + port));
