import express from 'express';
import morgan from 'morgan';
import fs from 'fs/promises';
import cors from 'cors';

const app = express();
const PORT = 8000;

app.use(morgan('tiny'));
app.use(express.json({ limit: '1000mb' }));
app.use(cors());

app.post('/save', (req, res) => {
  const document = req.body;
  fs.writeFile('../editorState.json', JSON.stringify(document.state));
  fs.writeFile('../editorContent.json', JSON.stringify(document.content));
  fs.writeFile('../editorSelection.json', JSON.stringify(document.selection));
  res.sendStatus(201);
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}...`);
});
