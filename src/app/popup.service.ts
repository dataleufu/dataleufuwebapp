import { Injectable }             from '@angular/core';
import {Subject} from 'rxjs/Rx';
//import 'rxjs/add/operator/toPromise';
@Injectable()
export class PopupService{
   show:Subject<boolean> = new Subject();
}
