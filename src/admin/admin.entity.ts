import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column("simple-array")
  roles: string[];

  // @Column({nullable: true})
  // lastLoginIp: string | undefined;
  //
  // @Column({nullable: true})
  // lastLoginDate: Date| undefined;
}


export class RegisterScreenDTO {
  screenId: string;
  authKey: string;
}
