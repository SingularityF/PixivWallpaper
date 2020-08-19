import { feedRefreshRate } from '../constants/defaultConfigs.json';

export default function feedTimerReducer(state = 0, action: any) {
  switch (action.type) {
    case 'TICK':
      return state - 1;
    case 'RESET':
      return feedRefreshRate;
    default:
      return state;
  }
}
