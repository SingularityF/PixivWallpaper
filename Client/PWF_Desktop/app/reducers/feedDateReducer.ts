export default function feedDateReducer(state = '', action: any) {
    switch (action.type) {
      case 'DATE_UPDATE':
        return action.data;
      default:
        return state;
    }
  }
  