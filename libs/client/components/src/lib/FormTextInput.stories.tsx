import React from 'react';
import { Story, Meta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormTextInput, FormTextInputProps } from './FormTextInput';

export default {
  component: FormTextInput,
  title: 'FormTextInput',
  args: { name: 'form-text-input' },
  argTypes: {
    backgroundColor: { control: 'color' },
    name: { control: 'text' },
    'fieldProps.label': { control: 'text' },
    variant: {
      options: ['standard', 'filled', 'outlined'],
      control: 'select',
    },
    size: {
      options: ['small', 'medium'],
      control: 'select',
    },
  },
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
        { name: 'blue', value: '#00f' },
      ],
    },
  },
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
  <FormTextInput /*name={args.name} fieldProps={args}*/ {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  fieldProps: {
    type: 'text',
    placeholder: 'placeholder',
    label: 'Username or Email',
    variant: 'outlined',
  },
};

// export const Test = Template.bind({});
// Test.args = {
//   fieldProps: {
//     type: 'text',
//     label: 'Username or Email',
//     variant: 'outlined',
//   },
// };
