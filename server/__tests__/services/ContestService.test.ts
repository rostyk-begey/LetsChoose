import container from '../container';
import contests from '../mocks/repositories/data/contests';
import { TYPES } from '../../inversify.types';
import ContestService from '../../services/ContestService';

const contestService = container.get<ContestService>(TYPES.ContestService);

test('Test find contest by id', async () => {
  const contest = await contestService.findContestById(contests[0].id);
  console.log(contest);
  expect(contest).toMatchObject(contests[0]);
});
