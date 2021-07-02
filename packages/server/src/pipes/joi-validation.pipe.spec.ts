import { ArgumentMetadata } from '@nestjs/common';
import { AnySchema, ValidationError } from 'joi';
import { JoiValidationPipe } from '@pipes/joi-validation.pipe';

describe('JoiValidationPipe', () => {
  let joiValidationPipe: JoiValidationPipe;
  const value = 'value';
  const newValue = 'newValue';
  const errorMessage = 'errorMessage';
  let schema: jest.Mocked<AnySchema>;
  let metadata: ArgumentMetadata;

  beforeEach(async () => {
    joiValidationPipe = new JoiValidationPipe(schema as AnySchema);
    metadata = { type: 'param' } as ArgumentMetadata;
  });

  describe.each`
    decorator
    ${undefined}
    ${'key'}
  `('transform $decorator', ({ decorator }) => {
    let schemaValue;
    let expectedValue;

    beforeAll(() => {
      schemaValue = decorator ? { [decorator]: value } : value;
      expectedValue = decorator ? { [decorator]: newValue } : newValue;
      metadata = { ...metadata, data: decorator };
    });

    beforeEach(async () => {
      schema = {
        validate: jest
          .fn()
          .mockReturnValue({ value: expectedValue, error: null }),
      } as unknown as jest.Mocked<AnySchema>;
      joiValidationPipe = new JoiValidationPipe(schema as AnySchema);
      metadata = { type: 'param' } as ArgumentMetadata;
    });

    it.each`
      type
      ${'body'}
      ${'query'}
      ${'param'}
      ${'custom'}
    `(
      'should validate and transform object correctly on $type type',
      ({ type }) => {
        const metadata = { type, data: decorator } as ArgumentMetadata;
        joiValidationPipe = new JoiValidationPipe(schema, type);

        const result = joiValidationPipe.transform(value, metadata);

        expect(result).toEqual(newValue);
        expect(schema.validate).toHaveBeenCalledWith(schemaValue, {
          convert: true,
        });
      },
    );

    it("should return default value if type didn't match", () => {
      joiValidationPipe = new JoiValidationPipe(schema, 'body');
      const result = joiValidationPipe.transform(value, metadata);
      expect(result).toEqual(value);
      expect(schema.validate).not.toHaveBeenCalled();
    });

    it('should throw error if validation fails', () => {
      schema = {
        validate: jest.fn().mockReturnValue({
          value: null,
          error: new ValidationError(errorMessage, null, null),
        }),
      } as unknown as jest.Mocked<AnySchema>;
      joiValidationPipe = new JoiValidationPipe(schema, metadata.type);
      expect.assertions(2);

      try {
        joiValidationPipe.transform(schemaValue, metadata);
      } catch (e) {
        expect(e.message).toEqual(errorMessage);
        expect(schema.validate).toHaveBeenCalledWith(schemaValue, {
          convert: true,
        });
      }
    });
  });
});
