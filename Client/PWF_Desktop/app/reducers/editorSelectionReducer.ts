export interface StateType {
  illustID: number;
  path: string;
  feedDate: string;
}

interface ActionType {
  type: string;
  illustID: number;
  path: string;
  feedDate: string;
}

let initialState = { illustID: 0, path: '', feedDate: '' };

export default function editorSelectionReducer(
  state: StateType = initialState,
  action: ActionType
) {
  switch (action.type) {
    case 'SELECTION_UPDATE':
      return {
        illustID: action.illustID,
        path: action.path,
        feedDate: action.feedDate,
      };
    case 'RESET_ALL':
      return initialState;
    default:
      return state;
  }
}
