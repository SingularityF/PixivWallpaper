import React, { useState, useEffect } from 'react';
import { Chip } from '@material-ui/core';
import styles from './Feed.css';
import { useSelector, useStore } from 'react-redux';
import { tick, reset } from '../../actions/feedTimerActions';
import { feedDateUpdate } from '../../actions/feedDateActions';
import { feedIllustUpdate } from '../../actions/feedIllustActions';
import StoreType, { IllustData } from '../../constants/storeType';
import moment from 'moment';
import axios from 'axios';
import {
  feedThumbnailUpdate,
  feedThumbnailReset,
} from '../../actions/feedThumbnailActions';
import {
  feedDownloadUpdate,
  feedDownloadReset,
} from '../../actions/feedDownloadActions';
import { appInitialized } from '../../actions/appInitializedActions';
import GlobalStyles from '../../constants/styles.json';
import { downloadImage } from '../DownloadManager/DownloadManager';

let timer: any = null;
let prevState: any = null;

export default function Feed() {
  const store = useStore();
  const timer_seconds = useSelector((state: StoreType) => state.feedTimer);

  let duration = moment.duration(timer_seconds, 'seconds');

  function readLocalStorage() {
    try {
      let feedDateLS =
        localStorage.getItem('feedDate') == null
          ? ''
          : localStorage.getItem('feedDate');

      let feedIllustLS =
        localStorage.getItem('feedIllust') == null
          ? []
          : JSON.parse(localStorage.getItem('feedIllust'));
      let feedThumbnailLS =
        localStorage.getItem('feedThumbnail') == null
          ? {}
          : JSON.parse(localStorage.getItem('feedThumbnail'));
      let feedDownloadLS =
        localStorage.getItem('feedDownload') == null
          ? {}
          : JSON.parse(localStorage.getItem('feedDownload'));
      store.dispatch(feedDateUpdate(feedDateLS));
      store.dispatch(feedIllustUpdate(feedIllustLS));
      for (const [key, value] of Object.entries(feedThumbnailLS)) {
        store.dispatch(feedThumbnailUpdate(parseInt(key), value));
      }
      for (const [key, value] of Object.entries(feedDownloadLS)) {
        store.dispatch(feedDownloadUpdate(parseInt(key), value));
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (
      store.getState().appInitialized &&
      prevState.feedTimer >= 0 &&
      store.getState().feedTimer <= 0
    ) {
      store.dispatch(reset());
      axios
        .get(
          'https://us-central1-pixivwallpaper.cloudfunctions.net/PWF_backend/pipeline/date/latest'
        )
        .then((res) => {
          localStorage.setItem('feedDate', res.data.latest);
          store.dispatch(feedDateUpdate(res.data.latest));
        });
    }
    if (
      store.getState().appInitialized &&
      prevState.feedDate != store.getState().feedDate
    ) {
      axios
        .get(
          `https://us-central1-pixivwallpaper.cloudfunctions.net/PWF_backend/ranking/unique/${
            store.getState().feedDate
          }`
        )
        .then((res) => {
          localStorage.setItem(
            'feedIllust',
            JSON.stringify(res.data.illustData)
          );
          store.dispatch(feedIllustUpdate(res.data.illustData));
        });
    }
    if (
      store.getState().appInitialized &&
      prevState.feedIllust != store.getState().feedIllust
    ) {
      store.dispatch(feedThumbnailReset());
      localStorage.removeItem('feedThumbnail');
      store.dispatch(feedDownloadReset());
      localStorage.removeItem('feedDownload');
      let currState: StoreType = store.getState();
      currState.feedIllust.forEach((illust: IllustData) => {
        axios
          .get(
            `https://us-central1-pixivwallpaper.cloudfunctions.net/PWF_backend/image/thumbnail/${illust.IllustID}`
          )
          .then((res) => {
            downloadImage(
              res.data.url,
              illust.IllustID,
              store.getState().feedDate,
              'thumbnail',
              (filePath: string) => {
                store.dispatch(feedThumbnailUpdate(illust.IllustID, filePath));
                localStorage.setItem(
                  'feedThumbnail',
                  JSON.stringify(store.getState().feedThumbnail)
                );
              }
            );
          });
      });
    }
    prevState = store.getState();
  });

  useState(() => {
    if (timer === null) {
      timer = setInterval(() => {
        store.dispatch(tick());
      }, 1000);
    }
    readLocalStorage();
    store.dispatch(appInitialized());
    prevState = store.getState();
  });

  return (
    <footer
      className={styles.footer}
      style={{ height: GlobalStyles.footerHeight }}
    >
      <Chip
        size="small"
        label={
          `Feed refreshing in\
        ${duration.hours().toString().padStart(2, '0')}:` +
          `${duration.minutes().toString().padStart(2, '0')}:` +
          `${duration.seconds().toString().padStart(2, '0')}`
        }
        color="primary"
      />
    </footer>
  );
}
