import { Column, Entity, PrimaryColumn } from "typeorm";

export interface ModeQueue{
  mode: string;
  switchToNext: number;
}

@Entity()
export class ScreenEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  lastIp: string;
  @Column({ default: 'pl' })
  language: string;
  @Column()
  authKey: string;
  @Column({ default: false })
  isConnected: boolean;
  @Column({ default: 'info' })
  currentDisplayMode: string;
  @Column({ nullable: true })
  lastConnection: Date;
  @Column({ default: false })
  isRegistered: boolean;
  @Column('simple-array', { default: '' })
  lockedModes: string[];
  @Column({ nullable: true })
  preferredRoom: string;
  @Column({ default: true })
  peopleMessages: boolean;
  @Column({ default: true })
  adminMessages: boolean;
  @Column({ default: 10000 })
  peopleMessageRotate: number;
  @Column({ default: 10 })
  maxMainRoomEntry: number;
  @Column({ default: 10 })
  maxOtherRoomEntry: number;
  @Column('simple-array', {default: ''} )
  modesQueue: string[];

}
