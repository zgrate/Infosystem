import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ScreenEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  lastIp: string;
  @Column({ default: "pl" })
  language: string;
  @Column()
  authKey: string;
  @Column({ default: false })
  isConnected: boolean;
  @Column({ default: "info" })
  currentDisplayMode: string;
  @Column({ nullable: true })
  lastConnection: Date;
  @Column({ default: false })
  isRegistered: boolean;
  @Column("simple-array", { default: "" })
  lockedModes: string[];
  @Column({ nullable: true })
  preferredRoom: string;
  @Column({ default: true })
  peopleMessages: boolean;
  @Column({ default: true })
  adminMessages: boolean;
  @Column({ default: 10000 })
  peopleMessageRotate: number;
}
