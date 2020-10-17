import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useStore } from 'react-redux';
import { Button, Box, Grid } from '@material-ui/core';
import Cropper from 'react-cropper';
import GlobalStyles from '../../constants/styles.json';
import { saveImage, makePath } from '../DownloadManager/DownloadManager';
import StoreData from '../../constants/storeType';
import { setWallpaper } from '../WallpaperSetter/WallpaperSetter';

export default function Editor() {
  const editorSelection = useSelector(
    (state: StoreData) => state.editorSelection
  );
  const cropperRef = useRef<HTMLImageElement>(null);
  let imageElement: any = null;
  let cropper: any = null;
  const onCrop = () => {
    imageElement = cropperRef?.current;
    cropper = imageElement?.cropper;
  };

  const crop = () => {
    let imgData = cropper.getCroppedCanvas().toDataURL();
    saveImage(
      makePath(
        editorSelection.illustID,
        editorSelection.feedDate,
        'edited',
        'png'
      ),
      Buffer.from(imgData.replace(/^data:image\/\w+;base64,/, ''), 'base64'),
      (filePath: string) => {setWallpaper(filePath);}
    );
  };

  return (
    <div
      align="center"
      style={{
        paddingTop: 15,
        paddingBottom: 15,
        overflowY: 'auto',
        overflowX: 'hidden',
        height: `calc(100vh - 30px - ${GlobalStyles.footerHeight}px)`,
      }}
    >
      <h4>
        {editorSelection.path == ''
          ? 'No image selected. Please select an image to edit in the Ranking tab.'
          : 'Image loaded. Please specify crop region.'}
      </h4>
      <Cropper
        src={editorSelection.path}
        style={{ height: 500, width: '100%' }}
        // Cropper.js options
        aspectRatio={16 / 9}
        guides={false}
        crop={onCrop}
        ref={cropperRef}
        zoomable={false}
        restore={false}
        viewMode={1}
      />
      <Button
        style={{ marginTop: '10px' }}
        variant="contained"
        color="primary"
        onClick={() => {
          crop();
        }}
      >
        Crop and set as wallpaper
      </Button>
    </div>
  );
}
