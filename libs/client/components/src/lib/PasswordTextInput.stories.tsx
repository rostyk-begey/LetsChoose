import React from 'react';
import { Story, Meta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormTextInputProps } from './FormTextInput';
import { PasswordTextInput } from './PasswordTextInput';

export default {
  component: PasswordTextInput,
  title: 'PasswordTextInput',
  decorators: [
    (Story) => {
      const form = useForm();

      return (
        <FormProvider {...form}>
          <Story />
        </FormProvider>
      );
    },
  ],
} as Meta;

const Template: Story<FormTextInputProps> = (args) => (
  <PasswordTextInput {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  name: 'password-text-input',
};
