import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  Box,
  CardActionArea,
  CardMedia,
  CardContent,
  CircularProgress,
  IconButton,
} from '@material-ui/core';
import { useSelector, useStore } from 'react-redux';
import StoreData from '../../constants/storeType';
import { Chip, Switch, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GlobalStyles from '../../constants/styles.json';
import { setWallpaper } from '../WallpaperSetter/WallpaperSetter';
import EmptyPatternImg from '../../res/imgs/empty_pattern_gray.png';
import axios from 'axios';
import process from 'process';
import { remote } from 'electron';
import path from 'path';
import { feedDownloadUpdate } from '../../actions/feedDownloadActions';
import { editorSelectionUpdate } from '../../actions/editorSelectorActions';
import fs from 'fs';
import {
  createFolder,
  downloadImage,
} from '../DownloadManager/DownloadManager';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

let urlJoin = require('url-join');
const useStyles = makeStyles({
  root: {
    maxWidth: 240,
  },
  media: {
    objectFit: 'contain',
  },
});

export default function Ranking() {
  const classes = useStyles();
  const store = useStore();
  const feedDate = useSelector((state: StoreData) => state.feedDate);
  const illusts = useSelector((state: StoreData) => state.feedIllust);
  const thumbnails = useSelector((state: StoreData) => state.feedThumbnail);
  const downloads = useSelector((state: StoreData) => state.feedDownload);
  const apiURL = useSelector((store: StoreData) => store.apiURL);

  const [state, setState] = useState({
    hideAdult: true,
  });

  const handleChange = (event: any) => {
    setState({ ...state, hideAdult: event.target.checked });
  };

  let downloadAndSet = async (illustID: number, feedDate: string) => {
    let imageUrl = await axios
      .get(
        urlJoin(apiURL, 'image', 'original', illustID.toString())
      )
      .then((res) => {
        return res.data.url;
      });
    downloadImage(
      imageUrl,
      illustID,
      feedDate,
      'original',
      (filePath: string) => {
        store.dispatch(feedDownloadUpdate(illustID, filePath));
        store.dispatch(editorSelectionUpdate(illustID, filePath, feedDate));
        setWallpaper(filePath);
        localStorage.setItem(
          'feedDownload',
          JSON.stringify(store.getState().feedDownload)
        );
      }
    );
  };

  const illustTemplate = (
    id: number,
    illustID: number,
    adult: string,
    url: string,
    feedDate: string
  ) => {
    if ((adult == 'LIKELY' || adult == 'VERY_LIKELY') && state.hideAdult) {
      return '';
    } else {
      return (
        <Grid item align="center" xs={12} sm={6} md={4} key={id}>
          <Box style={{ marginBottom: '8px', height: '24px' }}>
            {adult == 'LIKELY' || adult == 'VERY_LIKELY' ? (
              <Chip size="small" label="Adult" color="secondary" />
            ) : (
              <Box />
            )}
          </Box>
          <Card key={id} className={classes.root}>
            <CardActionArea
              onClick={() => {
                downloadAndSet(illustID, feedDate);
              }}
            >
              <Box textAlign="center" p={1}>
                # {id}
              </Box>
              <CardMedia
                component="img"
                className={classes.media}
                image={url == null ? EmptyPatternImg : url}
              />
            </CardActionArea>
            {illustID in downloads ? (
              <CardContent>
                <IconButton>
                  <CloudDownloadIcon color="primary" />
                </IconButton>
              </CardContent>
            ) : null}
          </Card>
        </Grid>
      );
    }
  };

  return (
    <div
      align="center"
      style={{
        padding: 15,
        overflowY: 'scroll',
        height: `calc(100vh - 30px - ${GlobalStyles.footerHeight}px)`,
      }}
    >
      <h4 style={{ marginBottom: '10px' }}>
        Artworks can be missing because they have already appeared in previous
        feeds.
      </h4>
      <FormControlLabel
        style={{ marginBottom: '20px' }}
        control={
          <Switch
            checked={state.hideAdult}
            onChange={handleChange}
            color="secondary"
          />
        }
        label="Hide adult content"
      />
      <Box>
        {illusts.length == 0 ? <CircularProgress color="secondary" /> : null}
      </Box>
      <Grid container spacing={3}>
        {illusts.map((data) =>
          illustTemplate(
            data.Rank,
            data.IllustID,
            data.Adult,
            thumbnails[data.IllustID],
            feedDate
          )
        )}
      </Grid>
    </div>
  );
}
