let initialState = [];

export default function feedIllustReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'ILLUST_UPDATE':
      return action.data;
    case 'RESET_ALL':
      return initialState;
    default:
      return state;
  }
}
