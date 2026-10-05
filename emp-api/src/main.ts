import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { registerEmployeeModule } from './modules/employees/employee.module';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

registerEmployeeModule(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('emp-api running on ' + port + ' | swagger: /swagger'));
