import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ProgramDescriptionEntity } from "./program-description.entity";

enum EventState {
  SCHEDULED = "scheduled",
  MOVED = "moved",
  CANCELLED = "cancelled",
  FINISHED = "finished",
}

enum EventType {
  PUBLIC_DURATION = "public_duration", //Event shown on a site and with duration
  PUBLIC_NO_DURATION = "public_no_duration", //Event shown on site, and without duration
  SCREEN_DURATION = "screen_duration", //Event shown on screens, and without duration
  SCREEN_NO_DURATION = "screen_no_duration", //Event shown on screens, and without duration
  PRIVATE_DURATION = "private_duration", //Event hidden, and without duration
  PRIVATE_NO_DURATION = "private_no_duration", //Event hidden, and without duration
}

@Entity()
export class ProgramEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  @OneToMany(() => ProgramDescriptionEntity, (program) => program.program)
  translations: ProgramDescriptionEntity[];

  @Column()
  eventState: EventState;

  @Column()
  eventType: EventType;

  @Column()
  eventStartTime: Date;

  @Column()
  changeStartTime: Date;

  @Column()
  eventScheduledLocation: string;

  @Column({ nullable: true })
  eventScheduledDurationMinutes: number;

  @Column({ nullable: true })
  eventChangedRoom: string;
}
