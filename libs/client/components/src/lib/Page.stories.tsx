import { Story, Meta } from '@storybook/react';
import { Page, PageProps as PageProps } from './Page';

export default {
  component: Page,
  title: 'Page',
} as Meta;

const Template: Story<PageProps> = (args) => <Page {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
