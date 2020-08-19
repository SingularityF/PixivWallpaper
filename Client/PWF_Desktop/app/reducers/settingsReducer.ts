export interface StateType {
  downloadSizeString: string;
}

const initialState = {
  downloadSizeString: '',
};

export default function settingsReducer(
  state: StateType = initialState,
  action: any
) {
  switch (action.type) {
    case 'UPDATE_DL_SIZE':
      return { ...state, downloadSizeString: action.data };
    default:
      return state;
  }
}
