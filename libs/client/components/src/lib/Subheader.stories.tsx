import { Story, Meta } from '@storybook/react';
import { Subheader, SubheaderProps as SubheaderProps } from './Subheader';

export default {
  component: Subheader,
  title: 'Subheader',
} as Meta;

const Template: Story<SubheaderProps> = (args) => <Subheader {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
