import express from 'express';
import accountRoutes from './src/routes/accountRoutes';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/accounts', accountRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});