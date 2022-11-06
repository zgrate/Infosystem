import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class AccreditationEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  birthDate: string;

  @Column({ nullable: true })
  roomNumber: number | undefined;

  @Column({ default: 0 })
  planSelected: number;

  @Column({ default: 0 })
  outStandingPaymentAccreditation: number;

  @Column({ default: false })
  top100: boolean;

  @Column({ nullable: true, default: 0 })
  roomPayment: number | undefined;

  @Column({ default: 0, nullable: true })
  outStandingPaymentHotel: number | undefined;

  @Column({ type: "simple-array" })
  tshirts: string[] = [];

  @Column({ type: "simple-array" })
  badges: string[] = [];

  @Column({ default: false })
  breakfast: boolean;

  @Column({ default: false })
  checkIn: boolean;

  @Column({ nullable: true })
  additionalInfo: string;

  @Column({ nullable: true })
  fursuitBadge: string | undefined;

  keysFree: boolean = false;
}
