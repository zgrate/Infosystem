import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { AccreditationEntity } from "../../accreditation/entities/accreditation.entity";

@Entity()
export class CatchThemAllEntity {
  @PrimaryColumn()
  fursuitId: string;

  @ManyToOne(() => AccreditationEntity)
  @JoinColumn()
  accredition: AccreditationEntity;

  @Column()
  fursuitName: string;

  @OneToMany(() => CatchThemAllCatchEntity, (it) => it.fursuitId)
  catched: CatchThemAllCatchEntity[];
}

@Entity()
export class CatchThemAllCatchEntity {
  @PrimaryGeneratedColumn()
  catchId: number;

  @ManyToOne(() => CatchThemAllEntity)
  fursuitId: string;

  @Column()
  tgUser: string;

  @Column("simple-array")
  photos: string[];
}
