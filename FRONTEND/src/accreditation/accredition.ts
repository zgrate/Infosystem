export interface RegisteredAcc {
  id: number;

  nickname: string;

  email: string;

  name: string;

  surname: string;

  birthDate: string;

  roomNumber: number | undefined;

  planSelected: number;

  outStandingPaymentAccreditation: number;

  top100: boolean;

  roomPayment: number | undefined;

  outStandingPaymentHotel: number | undefined;

  tshirts: string[];

  badges: string[];

  breakfast: boolean;

  checkIn: boolean;

  additionalInfo: string;

  keysFree: boolean;
}
