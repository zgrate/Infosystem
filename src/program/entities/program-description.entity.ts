import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProgramEntity } from "./program.entity";

@Entity()
export class ProgramDescriptionEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  lang: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => ProgramEntity, { nullable: true })
  program: ProgramEntity;
}
