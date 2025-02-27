import express, { Application, Request, Response } from 'express';

import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
 import cors from 'cors';
const app: Application = express();

 app.use(cors({ origin: 'http://localhost:5173', credentials:true }));
//parsers
app.use(express.json());
//app.use(cors())

app.use('/api', router);



app.get('/', (req: Request, res: Response) => {
  res.send('Welcome To DevAcademy Server');
});
app.use(globalErrorHandler);
app.use(notFound);

export default app;
