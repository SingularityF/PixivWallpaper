interface ActionType {
  type: string;
  key: number;
  data: string;
}

export default function feedThumbnailReducer(
  state: { [key: number]: string } = {},
  action: ActionType
) {
  switch (action.type) {
    case 'THUMBNAIL_RESET':
      return {};
    case 'THUMBNAIL_UPDATE':
      return { ...state, [action.key]: action.data };
    default:
      return state;
  }
}
