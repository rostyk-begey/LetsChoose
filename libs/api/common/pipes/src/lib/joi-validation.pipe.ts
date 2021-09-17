import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Paramtype,
  PipeTransform,
} from '@nestjs/common';
import { AnySchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: AnySchema, private type: Paramtype = 'body') {}

  transform(value: any, { type, data }: ArgumentMetadata) {
    if (type === this.type) {
      const { error, value: newValue } = this.schema.validate(
        data ? { [data]: value } : value,
        {
          convert: true,
        },
      );
      if (error) {
        throw new BadRequestException(error);
      }
      return data ? newValue[data] : newValue;
    }
    return value;
  }
}
