
import {mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable,timer,of} from 'rxjs';


@Injectable()
export class CorePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      if (route.data['delay']) {
        return timer(isNaN(route.data['delay']) ? 5000 : Number(route.data['delay'])).pipe(mergeMap(() => load()));
      }
      return load();
    } else {
      return of(null);
    }
  }
} 
  