import React, { useEffect, useState } from 'react';
const { getCurrentWindow } = require('electron').remote;
import {
  FormControl,
  CardContent,
  Typography,
  Card,
  Box,
  Grid,
  Button,
  TextField,
} from '@material-ui/core';
import {
  clearDownloads,
  showDownloadFolder,
  getDownloadFolder,
  getFolderSize,
} from '../DownloadManager/DownloadManager';
import { useSelector, useStore } from 'react-redux';
import StoreType, { IllustData } from '../../constants/storeType';
import { Refresh } from '@material-ui/icons';
import GlobalStyles from '../../constants/styles.json';
import { updateAPIURL } from '../../actions/APIConnectionActions';

export default function Settings() {
  const store = useStore();
  const sizeString = useSelector(
    (store: StoreType) => store.settings.downloadSizeString
  );
  const apiURL = useSelector((store: StoreType) => store.apiURL);
  const [inputValue, setInputValue] = useState('');
  function updateDLSize() {
    getFolderSize((sizeString: string) => {
      store.dispatch({ type: 'UPDATE_DL_SIZE', data: sizeString });
    });
  }
  useEffect(() => {
    updateDLSize();
  });

  return (
    <div
      style={{
        padding: 15,
        overflowY: 'scroll',
        height: `calc(100vh - 30px - ${GlobalStyles.footerHeight}px)`,
      }}
    >
      <div align="center">
        <h2>Settings</h2>
      </div>
      <Box m={5}>
        <Grid align="center" container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={async () => {
                await localStorage.clear();
                await clearDownloads();
                getCurrentWindow().reload();
              }}
            >
              Reset all
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                getCurrentWindow().reload();
              }}
            >
              Reset app state
            </Button>
          </Grid>
        </Grid>
        <Box mb={2}>
          <h3>API</h3>
          <hr></hr>
        </Box>
        <div>
          <Grid align="center" container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">API Endpoint</Typography>
                  <Typography
                    style={{ wordWrap: 'break-word' }}
                  >{`${apiURL}`}</Typography>
                  <Typography color="textSecondary">New API URL</Typography>
                  <FormControl fullWidth>
                    <TextField
                      id="outlined-basic"
                      label="New API URL"
                      variant="filled"
                      multiline
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  store.dispatch({ type: 'RESET_ALL' });
                  store.dispatch(updateAPIURL(inputValue));
                  localStorage.setItem('apiURL', inputValue);
                }}
              >
                Make connection to API
              </Button>
            </Grid>
          </Grid>
        </div>
        <Box mb={2}>
          <h3>Download</h3>
          <hr></hr>
        </Box>
        <Grid align="center" container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Download Folder</Typography>
                <Typography
                  style={{ wordWrap: 'break-word' }}
                >{`${getDownloadFolder()}`}</Typography>
                <Typography color="textSecondary">Download Size</Typography>
                <Typography>{`${sizeString}`}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                showDownloadFolder();
              }}
            >
              Open Download Folder
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<Refresh />}
              onClick={() => {
                updateDLSize();
              }}
            >
              Recalculate Size
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
