import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class QueryNumberValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const parsedValue = parseFloat(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException(
        `Invalid value for parameter ${metadata.data} - must be a number.`,
      );
    }

    return parsedValue;
  }
}
