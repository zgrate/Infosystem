import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ScreenEntity } from "../../shared/entities/definitions";

@Entity()
export class InfoModeEntity {

  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => ScreenEntity)
  @JoinColumn()
  screen: ScreenEntity;

  @Column({ nullable: true })
  preferredRoom: string;

  @Column({ default: "pl" })
  primaryLanguage: string;
}
