import { Story, Meta } from '@storybook/react';
import { ContestNavigation } from './ContestNavigation';

export default {
  component: ContestNavigation,
  title: 'ContestNavigation',
} as Meta;

const Template: Story = (args) => <ContestNavigation {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
