import React from 'react';
import { Story, Meta } from '@storybook/react';
import {
  AuthFormCardWithOAuth,
  AuthFormCardWithOAuthProps,
} from './AuthFormCardWithOAuth';

export default {
  component: AuthFormCardWithOAuth,
  title: 'AuthFormCardWithOAuth',
} as Meta;

const Template: Story<AuthFormCardWithOAuthProps> = (args) => (
  <AuthFormCardWithOAuth {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
