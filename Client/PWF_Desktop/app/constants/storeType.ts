import { StateType as SettingsStateType } from '../reducers/settingsReducer';

export default interface StoreData {
  appInitialized: boolean;
  feedTimer: number;
  feedDate: string;
  feedIllust: Array<IllustData>;
  feedThumbnail: { [key: number]: string };
  feedDownload: { [key: number]: string };
  settings: SettingsStateType;
}

export interface IllustData {
  Rank: number;
  IllustID: number;
}
