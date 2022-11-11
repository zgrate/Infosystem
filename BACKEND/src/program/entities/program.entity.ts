import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ProgramDescriptionEntity } from "./program-description.entity";

export const NEW_EVENT_REGISTERED = "program.event.new";
export const PROGRAM_ACCEPTED_EVENT = "program.event.accepted";

export type EventState =
  | "scheduled"
  | "moved"
  | "cancelled"
  | "finished"
  | "not_accepted"
  | "denied";

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

@Entity()
export class ProgramEntity {
  @PrimaryGeneratedColumn()
  internalId: number;

  @PrimaryColumn()
  externalId: string;

  @OneToMany(() => ProgramDescriptionEntity, (program) => program.program, {
    nullable: true
  })
  translations: ProgramDescriptionEntity[];

  @Column()
  eventState: EventState;

  @Column()
  eventType: EventType;

  @Column()
  eventStartTime: Date;

  @Column({ nullable: true })
  changeStartTime: Date;

  @Column()
  eventScheduledLocation: string;

  @Column({ nullable: true })
  changeEventEndTime: Date;

  @Column({ nullable: true })
  eventEndTime: Date;

  @Column({ nullable: true })
  eventChangedRoom: string;

  @Column({ nullable: true })
  tgUser: string;

  @Column("bigint", { nullable: true })
  tgId: number;

  @Column({ nullable: true })
  userId: number;
}
