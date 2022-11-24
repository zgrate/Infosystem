export const HallTypes = ['continuous', 'outdoor', 'attendee', 'highlight', 'room', '?other?'] as const;
export type HallType = typeof HallTypes[number];

export const HallVisibilityLevels = ['admin', 'organizator', 'orga-team', 'api', 'member', 'always'] as const;
export type HallVisibilityLevel = typeof HallVisibilityLevels[number];


export class HallTextDto {
  lang = 'PL';
  description: string;
  translatedName: string;
}

export class HallDto {
  id: number | undefined;
  name: string;
  type: HallType;
  restrictedEntryTypes: string; //TAK
  ownerId: number;
  ownerManaged: boolean;
  visibilityLevel: HallVisibilityLevel;
  index: number;
  texts: HallTextDto[];

  // "name": "name:R:{{$randomProductName}}",
  // "type": "room",
  // "restrictedEntryTypes": ["always"],
  // "ownerId": 5,
  // "ownerManaged": true,
  // "visibilityLevel": "always",
}
