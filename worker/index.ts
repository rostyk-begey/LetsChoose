import express, { Request } from 'express';
import mongoose from 'mongoose';
import NodeHashCash from 'node-hashcash';

import { Status, TaskModel } from './models/Task';
import config from './config';

const app = express();

app.post('/:taskId', async (req: Request<{ taskId: string }>, res) => {
  try {
    const task = await TaskModel.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ error: { message: 'invalid task id' } });
    }

    if (task.status === Status.FINISHED) {
      return res.status(200).json({ message: 'already finished' });
    }

    task.status = Status.IN_PROGRESS;

    await task.save();

    task.solution = await NodeHashCash.solveChallenge(task.challenge);
    task.status = Status.FINISHED;

    await task.save();

    res.status(200).json({ message: 'task solved' });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: { message: 'server error' } });
  }
});

(async () => {
  await mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  app.listen(process.env.PORT, () => {
    console.log(`Worker listening on ${process.env.PORT}`);
  });
})();
