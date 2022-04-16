import { build, fake, sequence } from '@jackfranklin/test-data-bot';
import { ContestDto } from '@lets-choose/common/dto';

export const contestBuilder = build<ContestDto>({
  fields: {
    id: sequence((i) => `contest-${i}`),
    games: fake((f) => f.datatype.number({ min: 0, precision: 1 })),
    thumbnail: fake((f) => f.image.image()),
    title: fake((f) => f.lorem.slug()),
    excerpt: fake((f) => f.lorem.slug()),
    author: fake((f) => f.internet.userName()),
    createdAt: fake((f) => f.date.past().toString()),
    items: [],
  },
});
