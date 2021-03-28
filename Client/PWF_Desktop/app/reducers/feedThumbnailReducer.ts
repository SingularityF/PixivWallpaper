interface ActionType {
  type: string;
  key: number;
  data: string;
}

let initialState = {};

export default function feedThumbnailReducer(
  state: { [key: number]: string } = initialState,
  action: ActionType
) {
  switch (action.type) {
    case 'THUMBNAIL_RESET':
      return {};
    case 'THUMBNAIL_UPDATE':
      return { ...state, [action.key]: action.data };
    case 'RESET_ALL':
      return initialState;
    default:
      return state;
  }
}
