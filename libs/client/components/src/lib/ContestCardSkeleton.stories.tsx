import { Story, Meta } from '@storybook/react';
import { ContestCardSkeleton } from './ContestCardSkeleton';

export default {
  component: ContestCardSkeleton,
  title: 'ContestCardSkeleton',
} as Meta;

const Template: Story = (args) => <ContestCardSkeleton {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
