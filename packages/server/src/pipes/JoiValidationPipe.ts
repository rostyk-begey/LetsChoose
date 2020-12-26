import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Paramtype,
} from '@nestjs/common';
import { AnySchema } from '@hapi/joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: AnySchema, private type: Paramtype = 'body') {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === this.type) {
      const { error } = this.schema.validate(value);
      if (error) {
        throw new BadRequestException(
          'Validation failed',
          error.details[0].message,
        );
      }
    }
    return value;
  }
}
