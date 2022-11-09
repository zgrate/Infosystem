import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AdminMessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  addDate: Date;

  @Column({ default: false })
  hidden: boolean;

  @Column({ nullable: true })
  expirationDate: Date;

  @Column()
  message: string;
}
