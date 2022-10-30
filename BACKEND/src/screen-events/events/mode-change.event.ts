export const MODE_CHANGE_EVENT = "screen.mode.change";

export class ModeChangeEvent {
  screenId: string;
  newMode: string;

  constructor(screenId: string, newMode: string) {
    this.screenId = screenId;
    this.newMode = newMode;
  }
}
