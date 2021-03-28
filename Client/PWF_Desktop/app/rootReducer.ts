import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import feedTimerReducer from './reducers/feedTimerReducer';
import feedDateReducer from './reducers/feedDateReducer';
import feedIllustReducer from './reducers/feedIllustReducer';
import feedThumbnailReducer from './reducers/feedThumbnailReducer';
import appInitializedReducer from './reducers/appInitializedReducer';
import settingsReducer from './reducers/settingsReducer';
import feedDownloadReducer from './reducers/feedDownloadReducer';
import recommenderDataReducer from './reducers/recommenderDataReducer';
import editorSelectionReducer from './reducers/editorSelectionReducer';
import APIConnectionReducer from './reducers/APIConnectionReducer';
// eslint-disable-next-line import/no-cycle

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    appInitialized: appInitializedReducer,
    apiURL: APIConnectionReducer,
    feedTimer: feedTimerReducer,
    feedDate: feedDateReducer,
    feedIllust: feedIllustReducer,
    feedThumbnail: feedThumbnailReducer,
    settings: settingsReducer,
    feedDownload: feedDownloadReducer,
    recommenderData: recommenderDataReducer,
    editorSelection: editorSelectionReducer,
  });
}
