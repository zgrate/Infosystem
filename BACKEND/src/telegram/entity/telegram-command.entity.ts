import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TelegramCommandEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  command: string;

  @Column()
  response: string;
}
