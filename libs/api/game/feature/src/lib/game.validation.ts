import Joi from 'joi';

import { joiObjectIdSchema } from '@lets-choose/api/common/utils';

export const gamePlaySchema = Joi.object({
  winnerId: Joi.string().required(),
});

export const gameIdSchema = Joi.object({ gameId: joiObjectIdSchema() });
export const contestIdSchema = Joi.object({ contestId: joiObjectIdSchema() });
