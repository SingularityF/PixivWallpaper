import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import { Button, Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import styles from './Home.css';
import { clearDownloads } from './DownloadManager/DownloadManager';

export default function Home() {
  return (
    <div align="center" style={{ padding: 10 }}>
      <h2>Home</h2>
      <Grid container spacing={1}>
        <Grid item align="center" xs={6} md={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              localStorage.clear();
            }}
          >
            Clear Local Storage
          </Button>
        </Grid>

        <Grid item align="center" xs={6} md={6}>
          <Button variant="contained" color="primary" onClick={clearDownloads}>
            Clear Downloads
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
