import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { isValidDate, dateToIsoString } from '../utils/date';

@Injectable()
export class QueryDateValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isValidDate(value)) {
      throw new BadRequestException(
        `Invalid value for parameter ${metadata.data} - must be a valid date.`,
      );
    }

    return dateToIsoString(value);
  }
}
