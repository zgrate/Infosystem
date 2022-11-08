import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class DbConfigEntity {
  @PrimaryColumn()
  key: string;

  @Column("simple-json")
  value: any;
}
