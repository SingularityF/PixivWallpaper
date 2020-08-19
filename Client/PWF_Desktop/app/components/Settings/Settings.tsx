import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import {
  clearDownloads,
  showDownloadFolder,
  getDownloadFolder,
  getFolderSize,
} from '../DownloadManager/DownloadManager';
import { useSelector, useStore } from 'react-redux';
import StoreType, { IllustData } from '../../constants/storeType';

export default function Settings() {
  const store = useStore();
  const sizeString = useSelector(
    (store: StoreType) => store.settings.downloadSizeString
  );
  useState(() => {
    getFolderSize((sizeString: string) => {
      store.dispatch({ type: 'UPDATE_DL_SIZE', data: sizeString });
    });
  });
  return (
    <div align="center">
      <h2>Settings</h2>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              localStorage.clear();
            }}
          >
            Clear Local Storage
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              clearDownloads();
            }}
          >
            Clear Downloads
          </Button>
        </Grid>
        <Grid item xs={12}>
          <span>{`Download Folder: ${getDownloadFolder()}`}</span>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              showDownloadFolder();
            }}
          >
            Open Downlaod Folder
          </Button>
        </Grid>
        <Grid item xs={12}>
          <span>{`Download Size: ${sizeString}`}</span>
        </Grid>
      </Grid>
    </div>
  );
}
