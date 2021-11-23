import React from 'react';
import { Story, Meta } from '@storybook/react';
import { PageWithForm } from './PageWithForm';

export default {
  component: PageWithForm,
  title: 'PageWithForm',
} as Meta;

const Template: Story = (args) => <PageWithForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
