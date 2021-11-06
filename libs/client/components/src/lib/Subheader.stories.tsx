import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Subheader, SubheaderProps } from './Subheader';

export default {
  component: Subheader,
  title: 'Subheader',
} as Meta;

const Template: Story<SubheaderProps> = (args) => <Subheader {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
