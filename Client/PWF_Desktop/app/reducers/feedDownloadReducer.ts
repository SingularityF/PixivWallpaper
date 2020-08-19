interface ActionType {
    type: string;
    key: number;
    data: string;
  }
  
  export default function feedDownloadReducer(
    state: { [key: number]: string } = {},
    action: ActionType
  ) {
    switch (action.type) {
      case 'DOWNLOAD_RESET':
        return {};
      case 'DOWNLOAD_UPDATE':
        return { ...state, [action.key]: action.data };
      default:
        return state;
    }
  }
  