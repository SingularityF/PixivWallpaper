import React, { useState, useEffect } from 'react';
import { Chip } from '@material-ui/core';
import styles from './Feed.css';
import { useSelector, useStore } from 'react-redux';
import { tick, reset } from '../../actions/feedTimerActions';
import { feedDateUpdate } from '../../actions/feedDateActions';
import { feedIllustUpdate } from '../../actions/feedIllustActions';
import StoreData, { IllustData } from '../../constants/storeType';
import moment from 'moment';
import axios from 'axios';
import { feedDownloadThumbnailUpdate } from '../../actions/feedDownloadActions';
import GlobalStyles from '../../constants/styles.json';

let timer: any = null;
let prevState: any = null;

export default function Feed() {
  const store = useStore();
  const timer_seconds = useSelector((state: StoreData) => state.feedTimer);

  let duration = moment.duration(timer_seconds, 'seconds');

  useEffect(() => {
    if (prevState.feedTimer >= 0 && store.getState().feedTimer <= 0) {
      store.dispatch(reset());
      axios
        .get(
          'https://us-central1-pixivwallpaper.cloudfunctions.net/PWF_backend/pipeline/date/latest'
        )
        .then((res) => {
          store.dispatch(feedDateUpdate(res.data.latest));
        });
    }
    if (prevState.feedDate != store.getState().feedDate) {
      axios
        .get(
          `https://us-central1-pixivwallpaper.cloudfunctions.net/PWF_backend/ranking/unique/${
            store.getState().feedDate
          }`
        )
        .then((res) => {
          store.dispatch(feedIllustUpdate(res.data.illustData));
        });
    }
    if (prevState.feedIllust != store.getState().feedIllust) {
      let currState: StoreData = store.getState();
      currState.feedIllust.forEach((illust: IllustData) => {
        axios
          .get(
            `https://us-central1-pixivwallpaper.cloudfunctions.net/PWF_backend/image/thumbnail/${illust.IllustID}`
          )
          .then((res) => {
            store.dispatch(
              feedDownloadThumbnailUpdate(illust.IllustID, res.data.url)
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
    prevState = store.getState();
  });

  return (
    <footer className={styles.footer} style={{height:GlobalStyles.footerHeight}}>
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
