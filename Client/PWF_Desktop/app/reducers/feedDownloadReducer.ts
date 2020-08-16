interface Action {
  type: String;
  key: number;
  data: String;
}

export default function feedDownloadReducer(
  state: { [key: number]: string } = {},
  action: Action
) {
  switch (action.type) {
    case 'THUMBNAIL_UPDATE':
      return { ...state, [action.key]: action.data };
    default:
      return state;
  }
}
