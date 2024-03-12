import express from 'express';
import { Logger, SecureStorage } from '@mondaycom/apps-sdk';

const app = express();
const port = 8080;

app.get('/health', (req, res) => {
  res.status(200).send({ 'status': 'OK' });
});

app.get('/deepHealth', async (req, res) => {
  const { randomWord } = req.query;
  const secure = new SecureStorage();
  const logger = new Logger('test-logger');

  try {
    logger.info(`This is a logger info. the random word is: ${randomWord}`);

    const key = Date.now() + '';
    const value = 'test';

    await secure.set(key, value);
    const result = await secure.get(key);
    const deleted = await secure.delete(key);
    const result2 = await secure.get(key);

    if (!(result === value && deleted && !result2)) {
      throw new Error('Secure storage assertion failed');
    }

    logger.debug(`Deep health finished successfully`);
    res.status(200).send({ 'status': 'OK' });

  } catch (error) {
    logger.error(`Deep health failed: ${error}`);
    res.status(500).send({ 'status': 'FAILED' });
  }
});


app.listen(port, () => console.log(`monday code tester app listening at http://localhost:${port}`));

