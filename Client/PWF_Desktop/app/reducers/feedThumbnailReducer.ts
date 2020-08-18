interface Action {
  type: string;
  key: number;
  data: string;
}

export default function feedThumbnailReducer(
  state: { [key: number]: string } = {},
  action: Action
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
