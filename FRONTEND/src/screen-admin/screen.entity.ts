export interface ScreenEntity {

  id: string;
  name: string;
  lastIp: string;
  language: string;
  authKey: string;
  isConnected: boolean;
  currentDisplayMode: DisplayModeType | string;
  lastConnection: Date;
  isRegistered: boolean;
  lockedModes: string[];
  preferredRoom: string;
  peopleMessages: boolean;
  adminMessages: boolean;
  peopleMessageRotate: number;
  maxMainRoomEntry: number;
  maxOtherRoomEntry: number;
  modesQueue: string[];
}

export type DisplayModeType = "connection_error" | "connecting" | "program" | "info" | "stream" | "message" | "change";

export interface AdminMessageEntity {
  id: number;
  addDate: Date;
  hidden: boolean;
  expirationDate: Date;
  message: string;
}


export interface PeopleMessageEntity {
  id: number;
  message: string;
  isAccepted: boolean;
  addDate: Date;
  expiration: Date;
  tgUser: string;
  imgUrl: string;
}
