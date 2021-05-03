import { Contest } from '../../contest.entity';

import contestItems from './contestItems';

export const contests: Omit<Contest, 'items' | 'createdAt'>[] = [
  {
    _id: '5f332014c17a495019dbc2e9',
    games: 0,
    thumbnail:
      'https://res.cloudinary.com/dcfzgnkj8/image/upload/v1597186069/contests/5f332014c17a495019dbc2e9/thumbnail.jpg',
    title: 'Contest 1',
    excerpt: 'Contest 1',
    author: '5f0e3e8cda24411b78617891',
    createdAt: new Date('2020-08-11T22:47:50.180Z'),
    id: '5f332014c17a495019dbc2e9',
  },
  {
    _id: '5f33b76dda1a0a058a034b51',
    games: 0,
    thumbnail:
      'https://res.cloudinary.com/dcfzgnkj8/image/upload/v1597224819/contests/5f33b76dda1a0a058a034b51/thumbnail.jpg',
    title: 'Test contest',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    author: '5f0e3e8cda24411b78617891',
    createdAt: new Date('2020-08-12T09:33:40.736Z'),
    id: '5f33b76dda1a0a058a034b51',
  },
  {
    _id: '5f33b7d6da1a0a058a034b57',
    games: 0,
    thumbnail:
      'https://res.cloudinary.com/dcfzgnkj8/image/upload/v1597224922/contests/5f33b7d6da1a0a058a034b57/thumbnail.jpg',
    title: 'dfvgdfgfgxb',
    excerpt: 'zdfsdfsvfv',
    author: '5f0e3e8cda24411b78617891',
    createdAt: new Date('2020-08-12T09:35:22.925Z'),
    id: '5f33b7d6da1a0a058a034b57',
  },
  {
    _id: '5f356138cf38e922503cb564',
    thumbnail:
      'https://res.cloudinary.com/dcfzgnkj8/image/upload/v1597333818/contests/5f356138cf38e922503cb564/thumbnail.jpg',
    title: 'New test contest',
    excerpt: 'New test contest',
    author: '5f0e3e8cda24411b78617891',
    createdAt: new Date('2020-08-13T15:50:19.349Z'),
    games: 17,
    id: '5f356138cf38e922503cb564',
  },
  {
    _id: '5f60ef3004a38c1f89e39400',
    games: 0,
    thumbnail:
      'https://res.cloudinary.com/dcfzgnkj8/image/upload/v1600195665/contests/5f60ef3004a38c1f89e39400/thumbnail.jpg',
    title: 'Qwerty 1',
    excerpt: 'Qwerty',
    author: '5f0e3e8cda24411b78617891',
    createdAt: new Date('2020-09-15T16:43:29.945Z'),
    id: '5f60ef3004a38c1f89e39400',
  },
  {
    _id: '5f6133f4f1a44e415658bbb3',
    games: 0,
    thumbnail:
      'https://res.cloudinary.com/dcfzgnkj8/image/upload/v1600205814/contests/5f6133f4f1a44e415658bbb3/thumbnail.jpg',
    title: 'Other author',
    excerpt: 'Other author',
    author: '5f2450497c0eda57ac09b606',
    createdAt: new Date('2020-09-15T21:36:55.102Z'),
    id: '5f6133f4f1a44e415658bbb3',
  },
  {
    _id: '5f89dc3289fccc0024b2976d',
    games: 10,
    thumbnail:
      'https://res.cloudinary.com/dcfzgnkj8/image/upload/v1602870322/contests/5f89dc3289fccc0024b2976d/thumbnail.jpg',
    title: 'Test 111',
    excerpt: 'Test 111',
    author: '5f0e3e8cda24411b78617891',
    createdAt: new Date('2020-10-16T17:45:23.374Z'),
    id: '5f89dc3289fccc0024b2976d',
  },
].map(({ id, ...rest }) => ({
  id,
  ...rest,
  items: contestItems.filter(({ contestId }) => contestId === id),
}));

export default contests as Contest[];
