interface ActionType {
  type: string;
}

export default function appInitializedReducer(
  state: Boolean = false,
  action: ActionType
) {
  switch (action.type) {
    case 'INIT_DONE':
      return true;
    default:
      return state;
  }
}
