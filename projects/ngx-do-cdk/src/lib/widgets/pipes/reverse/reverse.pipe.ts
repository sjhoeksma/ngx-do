import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(value) {
      if (!value || !Array.isArray(value)) {
        return value;
      }
      return [...value].reverse();
    }
} 