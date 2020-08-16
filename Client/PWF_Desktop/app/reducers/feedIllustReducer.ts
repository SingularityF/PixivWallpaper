export default function feedIllustReducer(state = [], action: any) {
    switch (action.type) {
      case 'ILLUST_UPDATE':
        return action.data;
      default:
        return state;
    }
  }
  