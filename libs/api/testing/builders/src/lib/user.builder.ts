import { build, fake, oneOf, sequence } from '@jackfranklin/test-data-bot';
import { User } from '@lets-choose/api/user/data-access';
import { Types } from 'mongoose';

export const userBuilder = build<User>({
  fields: {
    avatar: fake((f) => f.image.avatar()),
    bio: fake((f) => f.lorem.paragraph(2)),
    confirmed: oneOf(true),
    passwordVersion: fake((f) => f.datatype.number({ min: 1 })),
    id: sequence((i) => `user-${i}`),
    _id: sequence((i) => `user-${i}`),
    email: fake((f) => f.internet.email()),
    username: fake((f) => f.internet.userName().toLowerCase()),
    password: fake((f) => f.internet.password()),
  },
  traits: {
    realId: {
      overrides: {
        _id: new Types.ObjectId().toString(),
      },
    },
  },
  postBuild: (res) => ({
    ...res,
    id: res._id,
  }),
});
