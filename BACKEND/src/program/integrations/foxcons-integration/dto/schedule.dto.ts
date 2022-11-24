export const ScheduleEntryVisibilityLevels = ['admin', 'organizator', 'orga-team', 'api', 'member', 'always'] as const;
export type ScheduleEntryVisibilityLevel = typeof ScheduleEntryVisibilityLevels[number];

export const ScheduleEntryTargets = ['everywhere', 'tv', 'api', 'mobile'] as const;
export type ScheduleEntryTarget = typeof ScheduleEntryTargets[number];

/**
 * everyone -> everyone can attend, there is no list of attendees
 * registered -> everyone can attend, there is a list of attendees
 * limited -> everyone can invite themselves, until the maximum number of attendees is reached
 * hidden -> only invited can attend (see) (+orgs, helpers, etc)
 */
export const ScheduleEntryAttendanceTypes = ['everyone', 'registered', 'limited', 'hidden'] as const;
export type ScheduleEntryAttendanceType = typeof ScheduleEntryAttendanceTypes[number];

export class ScheduleDetailDto {
  lang = 'PL';
  displayName: string;
  details: string;
}

export class ScheduleDto {
  id: number | undefined;

  name: string;
  leaderId: number;
  subLeaders: number[];
  helpers: number[];

  visibilityLevel: ScheduleEntryVisibilityLevel;
  displayTarget: ScheduleEntryTarget;
  hallId: number;
  timeBegin: string;
  timeEnd: string;
  duration: number;
  durationEstimate: number;

  canBeExtended: boolean;
  isDraft: boolean;
  is18Plus: boolean;
  attendanceType: ScheduleEntryAttendanceType;

  details: ScheduleDetailDto[];
  overrideColor: string;

  // "name": "system Name",
  // "leaderId": 69,
  // "subLeaders": [4, 8],
  // "helpers": [10],

  // "visibilityLevel": "always",
  // "displayTarget": "everywhere",
  // "hallId": 8,
  // "timeBegin": "2022-11-08 10:00:00",
  // "timeEnd": "2022-11-08 12:00:00",
  // "duration": 120,
  // "durationEstimate": 120,
}
