export interface RecommenderDataType {
  aspectRatio: number;
}

const initialState: RecommenderDataType = {
  aspectRatio: 0,
};

export interface ActionType {
  type: string;
  key: string;
  data: any;
}

export default function recommenderDataReducer(
  state: RecommenderDataType = initialState,
  action: ActionType
) {
  switch (action.type) {
    case 'UPDATE_AR':
      return { ...state, [action.key]: action.data };
    default:
      return state;
  }
}
