import { Story, Meta } from '@storybook/react';
import {
  CircularProgressWithLabel,
  CircularProgressWithLabelProps,
} from './CircularProgressWithLabel';

export default {
  component: CircularProgressWithLabel,
  title: 'CircularProgressWithLabel',
} as Meta;

const Template: Story<CircularProgressWithLabelProps> = (args) => (
  <CircularProgressWithLabel {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
