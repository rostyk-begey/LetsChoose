import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Paramtype,
} from '@nestjs/common';
import { AnySchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: AnySchema, private type: Paramtype = 'body') {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === this.type) {
      const { error, value: newValue } = this.schema.validate(value, {
        convert: true,
      });
      if (error) {
        throw new BadRequestException(error);
      }
      return newValue;
    }
    return value;
  }
}
