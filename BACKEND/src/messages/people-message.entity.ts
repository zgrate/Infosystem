import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PeopleMessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ default: false })
  isAccepted: boolean;

  @Column()
  addDate: Date;
  @Column({ nullable: true })
  expiration: Date;

  @Column()
  tgUser: string;

  @Column({ nullable: true })
  imgUrl: string;
}
