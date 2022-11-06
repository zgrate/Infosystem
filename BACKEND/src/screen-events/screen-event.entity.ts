import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ScreenEntity } from "../shared/entities/definitions";

@Entity()
export class ScreenEventEntity {
  @PrimaryGeneratedColumn()
  screenEntityEntry: number;

  @OneToOne(() => ScreenEntity, (it) => it.id)
  @JoinColumn()
  screen: ScreenEntity;

  @Column()
  displayPriority: string;
}
