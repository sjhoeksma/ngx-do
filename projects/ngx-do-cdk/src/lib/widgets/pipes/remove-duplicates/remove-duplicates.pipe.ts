import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'removeduplicates'
})
export class RemoveDuplicatesPipe implements PipeTransform{
  
  private filter(array, key) {
    let seen
    let index = -1
    let resIndex = 0

    const { length } = array
    const result = []

    while (++index < length) {
      const value = array[index]
      if (!index || (value[key] && value[key]!=seen[key])) {
        seen = value
        result[resIndex++] = value === 0 ? 0 : value
      }
    }
    return result
  }
  
   transform(value: any,key:string="id"): any{
        if(value!== undefined && value!== null){
            return this.filter(value, key);
        }
        return value;
    }
}