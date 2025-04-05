import express from 'express';
import userRouter from './routes/users.ts';
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
