let initialState = '';

export default function feedDateReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'DATE_UPDATE':
      return action.data;
    case 'RESET_ALL':
      return initialState;
    default:
      return state;
  }
}
