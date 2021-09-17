import React from 'react';
import { Story, Meta } from '@storybook/react';
import faker from 'faker';
import * as NextImage from 'next/image';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '@lets-choose/client/utils';
import { ContestCard, ContestCardProps } from './ContestCard';

const nextImageContainerStyle: any = {
  display: 'block',
  overflow: 'hidden',
  position: 'absolute',
  inset: 0,
  boxSizing: 'border-box',
  margin: 0,
};

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props: any) => (
    <div style={nextImageContainerStyle}>
      <img
        style={{
          ...nextImageContainerStyle,
          width: 0,
          height: 0,
          minWidth: '100%',
          minHeight: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'cover',
          margin: 'auto',
          padding: 0,
        }}
        {...props}
      />
    </div>
  ),
});

export default {
  component: ContestCard,
  title: 'ContestCard',
  argTypes: { onDelete: { action: 'clicked' } },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
} as Meta;

const Template: Story<ContestCardProps> = (args) => <ContestCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  contest: {
    _id: 'contestId',
    games: faker.random.number(0),
    thumbnail: faker.image.image(),
    title: faker.lorem.sentence(),
    excerpt: faker.lorem.sentences(),
    author: {
      _id: faker.random.alphaNumeric(8),
      email: faker.internet.email(),
      avatar: faker.internet.avatar(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    },
    createdAt: new Date().toString(),
    id: 'contestId',
    items: [],
  },
};
