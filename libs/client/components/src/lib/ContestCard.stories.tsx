import React, { CSSProperties } from 'react';
import { queryClient } from '@lets-choose/client/utils';
import { Meta, Story } from '@storybook/react';
import faker from 'faker';
import * as NextImage from 'next/image';
import { QueryClientProvider } from 'react-query';
import { ContestCard, ContestCardProps } from './ContestCard';

const nextImageContainerStyle: CSSProperties = {
  display: 'block',
  overflow: 'hidden',
  position: 'absolute',
  inset: 0,
  boxSizing: 'border-box',
  margin: 0,
};

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (
    props: React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
  ) => (
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
    id: 'contestId',
    games: faker.random.number(0),
    thumbnail: faker.image.image(),
    title: faker.lorem.sentence(),
    excerpt: faker.lorem.sentences(),
    author: {
      id: faker.random.alphaNumeric(8),
      email: faker.internet.email(),
      avatar: faker.internet.avatar(),
      username: faker.internet.userName(),
    },
    createdAt: new Date().toString(),
    items: [],
  },
};
