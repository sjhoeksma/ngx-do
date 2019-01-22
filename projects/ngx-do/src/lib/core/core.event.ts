import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CoreEvent {
    public static readonly core_channel = 'core';
    public static readonly default_channel = 'default';
    private channels = {};

    private channel(channel: string): Subject<any> {
      if (!this.channels[channel]) { this.channels[channel] = new Subject<any>(); }
      return this.channels[channel];
    }

    public send(event: any, channel: string= CoreEvent.default_channel) {
        if (typeof event === 'string') {
           this.channel(channel).next({event: event});
        } else {
          this.channel(channel).next(event);
        }
    }

    public clear(channel: string= null) {
      if (!channel) {
        for (const key in this.channels) {
         if (!this.channels.hasOwnProperty(key)) { continue; }
         this.channel(key).next();
        }
      } else {
        this.channel(channel).next();
      }
    }

    public get(channel: string= CoreEvent.default_channel): Observable<any> {
        return this.channel(channel).asObservable();
    }

    public subscribe(func: Function, eventRegExp: string= '.*', channel: string= CoreEvent.default_channel) {
     const reg = new RegExp(eventRegExp, 'i');
     this.channel(channel).subscribe(
          event => {
            if (reg.test(event.event)) { func(event); }
          });
    }
}
