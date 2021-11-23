import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Page, PageProps } from './Page';

export default {
  component: Page,
  title: 'Page',
} as Meta;

const Template: Story<PageProps> = (args) => <Page {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
