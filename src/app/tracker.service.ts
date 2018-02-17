import {Injectable} from "@angular/core";

declare var ga:Function;


@Injectable()
export class TrackerService {

  public emitEvent(eventCategory: string,
                   eventAction: string,
                   eventLabel: string = null,
                   eventValue: number = null) {
    console.log("Enviando evento a Analytics ", eventCategory, eventAction, eventLabel, eventValue);
    ga('send', 'event', {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    });
  }
}
