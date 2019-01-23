import { NgModule } from '@angular/core';
import { ReversePipe } from './reverse/reverse.pipe';
import { CallbackPipe } from './callback/callback.pipe';
import { TimeAgoPipe } from './timeago/timeago.pipe';
import { SafeUrlPipe } from './safe-url/safe-url.pipe';
import { KeysPipe } from './keys/keys.pipe';
import { RemoveDuplicatesPipe } from './remove-duplicates/remove-duplicates.pipe';

@NgModule({
  declarations: [
      ReversePipe,
      KeysPipe,
      CallbackPipe,
      TimeAgoPipe,
      SafeUrlPipe,
      RemoveDuplicatesPipe
      ],
  exports: [
      ReversePipe,
      CallbackPipe,
      TimeAgoPipe,
      KeysPipe,
      SafeUrlPipe,
      RemoveDuplicatesPipe
  ]
})
export class NgxDoPipesModule { }