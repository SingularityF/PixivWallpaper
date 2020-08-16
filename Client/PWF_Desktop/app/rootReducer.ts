import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import feedTimerReducer from './reducers/feedTimerReducer';
import feedDateReducer from './reducers/feedDateReducer';
import feedIllustReducer from './reducers/feedIllustReducer';
import feedDownloadReducer from './reducers/feedDownloadReducer';
// eslint-disable-next-line import/no-cycle

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    feedTimer: feedTimerReducer,
    feedDate: feedDateReducer,
    feedIllust: feedIllustReducer,
    feedDownload: feedDownloadReducer
  });
}
