import React from 'react';
import { Story, Meta } from '@storybook/react';
import { InputWithIcon, InputWithIconProps } from './InputWithIcon';

export default {
  component: InputWithIcon,
  title: 'InputWithIcon',
} as Meta;

const Template: Story<InputWithIconProps> = (args) => (
  <InputWithIcon {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
