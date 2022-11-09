export const SETTINGS_UPDATE_EVENT = "screen.settings.update";

export class SettingsUpdateEvent {
  screenId: string;

  constructor(screenId: string) {
    this.screenId = screenId;
  }
}
