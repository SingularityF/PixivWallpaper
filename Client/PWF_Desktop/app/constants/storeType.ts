import { StateType as SettingsStateType } from '../reducers/settingsReducer';
import { StateType as EditorSelectionStateType } from '../reducers/editorSelectionReducer';

export default interface StoreData {
  appInitialized: boolean;
  apiURL: string;
  feedTimer: number;
  feedDate: string;
  feedIllust: Array<IllustData>;
  feedThumbnail: { [key: number]: string };
  feedDownload: { [key: number]: string };
  settings: SettingsStateType;
  editorSelection: EditorSelectionStateType;
}

export interface IllustData {
  Rank: number;
  IllustID: number;
  Adult: string;
}
