import { ProgramDescriptionEntity } from "./program-description.entity";

export const NEW_EVENT_REGISTERED = "program.event.new";
export const PROGRAM_ACCEPTED_EVENT = "program.event.accepted";
export const PROGRAM_UPDATE_EVENT = "program.update.event";

export type EventState =
  | "scheduled"
  | "moved"
  | "cancelled"
  | "finished"
  | "not_accepted"
  | "denied"
  | "hidden";

export type EventType =
  | "public_duration"
  | "public_no_duration"
  | "screen_duration"
  | "screen_no_duration"
  | "private_duration"
  | "private_no_duration";
//   PUBLIC_DURATION = 'public_duration', //Event shown on a site and with duration
//   PUBLIC_NO_DURATION = 'public_no_duration', //Event shown on site, and without duration
//   SCREEN_DURATION = 'screen_duration', //Event shown on screens, and without duration
//   SCREEN_NO_DURATION = 'screen_no_duration', //Event shown on screens, and without duration
//   PRIVATE_DURATION = 'private_duration', //Event hidden, and without duration
//   PRIVATE_NO_DURATION = 'private_no_duration', //Event hidden, and without duration
// }

export interface ProgramEntity {
  internalId: number;

  externalId: string;

  translations: ProgramDescriptionEntity[];

  eventState: EventState;

  eventType: EventType;

  eventStartTime: Date;

  changeStartTime: Date;

  eventScheduledLocation: string;

  changeEventEndTime: Date;

  eventEndTime: Date;

  eventChangedRoom: string;

  tgUser: string;

  tgId: number;

  userId: number;

  programType: "schedule" | "activity";
}
