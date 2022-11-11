import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AccreditationEntity } from "../../accreditation/entities/accreditation.entity";

@Entity()
export class AuthorisedTgUserEntity {
  @PrimaryGeneratedColumn()
  userId: string;

  @Column({ nullable: true })
  tgUsername: string;

  @Column("bigint")
  tgId: string;

  @Column()
  authCode: string;

  @OneToOne(() => AccreditationEntity, { nullable: true })
  linkedAccreditation: AccreditationEntity;
}
