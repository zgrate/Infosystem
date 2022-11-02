import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class RegisteredPerson {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  birthDate: string;

  @Column({ nullable: true })
  roomNumber: number | undefined;

  @Column()
  planSelected: number;

  @Column({ default: 0 })
  outStandingPaymentAccreditation: number;

  @Column({ default: false })
  top100: boolean;

  @Column()
  roomPayment: number;

  @Column({ default: 0 })
  outStandingPaymentHotel: number;

  @Column({ default: false })
  breakfast: boolean;

  @Column({ default: false })
  checkIn: boolean;
}
