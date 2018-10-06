import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeago'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value:number):string {
    if (value===null) return '';
    var seconds = Math.floor((new Date().getTime() - value) / 1000);
    var interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
      return interval +  " year" + (interval>1 ? 's' :'');
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + " month" + (interval>1 ? 's' :'');
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + " day" + (interval>1 ? 's' :'');
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + " hr" + (interval>1 ? 's' :'');
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + " min" + (interval>1 ? 's' :'');
    }
    return Math.floor(seconds) + " sec" + (interval>1 ? 's' :'');
  }
     
} 
  