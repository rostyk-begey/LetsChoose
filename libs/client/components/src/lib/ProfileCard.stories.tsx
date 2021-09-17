import { Meta, Story } from '@storybook/react';
import faker from 'faker';
import { ProfileCard, ProfileCardProps } from './ProfileCard';

export default {
  component: ProfileCard,
  title: 'ProfileCard',
} as Meta;

const Template: Story<ProfileCardProps> = (args) => <ProfileCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  user: {
    _id: faker.random.alphaNumeric(8),
    id: faker.random.alphaNumeric(8),
    email: faker.internet.email(),
    avatar: faker.internet.avatar(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  },
};
