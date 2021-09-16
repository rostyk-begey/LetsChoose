import { IUserRepository } from '@lets-choose/api/abstract';
import { build, fake, oneOf, sequence } from '@jackfranklin/test-data-bot';
import { User, UserDocument } from '@lets-choose/api/user/data-access';
import { Types } from 'mongoose';

export const userBuilder = build<User>({
  fields: {
    avatar: fake((f) => f.image.avatar()),
    bio: fake((f) => f.lorem.paragraph(2)),
    confirmed: oneOf(true),
    passwordVersion: fake((f) => f.random.number({ min: 1 })),
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

const userRepository: jest.Mocked<IUserRepository> = {
  findById: jest.fn(),
  findByIdOrFail: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByUsername: jest.fn(),
  findByEmail: jest.fn(),
  deleteUser: jest.fn(),
  createUser: jest.fn(),
};

export default userRepository;
