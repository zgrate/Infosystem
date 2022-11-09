import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ScreenEntity } from "../../shared/entities/screen.entity";

@Entity()
export class StreamModeEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => ScreenEntity)
  @JoinColumn()
  screen: ScreenEntity;

  @Column()
  primaryStreamLink: string;

  @Column("simple-array")
  backupStreamLinks: string[];
}
