import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  Box,
  CardActionArea,
  CardMedia,
  CardContent,
  CircularProgress,
} from '@material-ui/core';
import { useSelector, useStore } from 'react-redux';
import StoreData from '../../constants/storeType';
import { makeStyles } from '@material-ui/core/styles';
import GlobalStyles from '../../constants/styles.json';
import EmptyPatternImg from '../../res/imgs/empty_pattern_gray.png';

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
  const illusts = useSelector((state: StoreData) => state.feedIllust);
  const thumbnails = useSelector((state: StoreData) => state.feedDownload);

  const illustTemplate = (id: number, url: string) => {
    return (
      <Grid item align="center" xs={12} sm={6} md={4} key={id}>
        <Card key={id} className={classes.root}>
          <CardActionArea>
            <Box textAlign="center" p={1}>
              # {id}
            </Box>
            <CardMedia
              component="img"
              className={classes.media}
              image={url == null ? EmptyPatternImg : url}
            />
          </CardActionArea>
        </Card>
      </Grid>
    );
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
      <h4>
        Artworks can be missing because they either contain sensitive content or
        have already appeared in previous feeds.
      </h4>
      {illusts.length == 0 ? <CircularProgress color="secondary" /> : null}
      <Grid container spacing={3}>
        {illusts.map((data) =>
          illustTemplate(data.Rank, thumbnails[data.IllustID])
        )}
      </Grid>
    </div>
  );
}
