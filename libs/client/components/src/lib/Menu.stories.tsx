import { Story, Meta } from '@storybook/react';
import { Menu, MenuProps as MenuProps } from './Menu';

export default {
  component: Menu,
  title: 'Menu',
} as Meta;

const Template: Story<MenuProps> = (args) => <Menu {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
