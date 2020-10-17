import feedDateReducer from "../reducers/feedDateReducer";

export const editorSelectionUpdate = (illustID: number, path: string, feedDate: string) => {
    return {
      type: 'SELECTION_UPDATE',
      path: path,
      illustID: illustID,
      feedDate: feedDate,
    };
  };