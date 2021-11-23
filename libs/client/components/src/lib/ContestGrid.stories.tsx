import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ContestGrid, ContestGridProps } from './ContestGrid';

export default {
  component: ContestGrid,
  title: 'ContestGrid',
} as Meta;

const Template: Story<ContestGridProps> = (args) => <ContestGrid {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
