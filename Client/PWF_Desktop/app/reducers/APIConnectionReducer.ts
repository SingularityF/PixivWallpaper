interface ActionType {
  type: string;
  data: string;
}

export default function APIConnectionReducer(
  state: string = "",
  action: ActionType
) {
  switch (action.type) {
    case 'API_LOADED':
      return action.data;
    default:
      return state;
  }
}
