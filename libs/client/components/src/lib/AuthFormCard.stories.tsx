import React from 'react';
import { Story, Meta } from '@storybook/react';
import { AuthFormCard, AuthFormCardProps } from './AuthFormCard';

export default {
  component: AuthFormCard,
  title: 'AuthFormCard',
} as Meta;

const Template: Story<AuthFormCardProps> = (args) => <AuthFormCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
