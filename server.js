import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({
  static: 'public',
  bodyParser: true,
  logger: true,
});

app.use(middlewares);
app.use(router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
