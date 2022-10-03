import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ScreenEntity {

  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  lastIp: string;
  @Column()
  language: string;
  @Column()
  authKey: string;
  @Column({ default: false })
  isConnected: boolean;
  @Column({ default: "info" })
  currentDisplayMode: string;
  @Column()
  lastConnection: Date;

  constructor() {
  }
}
