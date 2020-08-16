export default function feedTimerReducer(state = 0, action: any) {
  switch (action.type) {
    case 'TICK':
      return state - 1;
    case 'RESET':
      return 60;
    default:
      return state;
  }
}
