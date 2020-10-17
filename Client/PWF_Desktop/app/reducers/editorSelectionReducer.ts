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

export default function editorSelectionReducer(
  state: StateType = { illustID: 0, path: '', feedDate: '' },
  action: ActionType
) {
  switch (action.type) {
    case 'SELECTION_UPDATE':
      return {
        illustID: action.illustID,
        path: action.path,
        feedDate: action.feedDate,
      };
    default:
      return state;
  }
}
