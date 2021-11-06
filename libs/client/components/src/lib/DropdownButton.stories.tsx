import React from 'react';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { Story, Meta } from '@storybook/react';
import { DropdownButton, DropdownButtonProps } from './DropdownButton';

export default {
  component: DropdownButton,
  title: 'DropdownButton',
} as Meta;

const Template: Story<DropdownButtonProps> = (args) => (
  <DropdownButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  mainButtonProps: {
    startIcon: <PlayCircleFilledWhiteIcon />,
    children: 'Play',
    onClick: () => null,
  },
  items: [
    {
      content: 'Dropdown item 1',
      onClick: () => null,
    },
    {
      content: 'Dropdown item 2',
      onClick: () => null,
    },
  ],
};
