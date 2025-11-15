import express from 'express'
import cors from 'cors'
import dotenv from "dotenv";
dotenv.config()

import { startImapSync } from "./imap/startSync";
import { setupEmailIndex } from './es/setup';
import searchRouter from "./routes/search";
import emailRouter from './routes/emails'
import foldersRouter from './routes/folders'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/search", searchRouter)
app.use("/emails", emailRouter);
app.use("/folders", foldersRouter);

async function bootstrap() {
    console.log('index setup')
    await setupEmailIndex();
    await startImapSync();

    app.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
    });
}

bootstrap().catch((err) => {
    console.error("Fatal error during startup:", err);
});