import React, { useEffect, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { remote } from 'electron';
import { ActionType as RecommenderDataActionType } from '../../reducers/recommenderDataReducer';

export default function Recommender() {
  const store = useStore();
  useState(() => {
    const { width, height } = remote.screen.getPrimaryDisplay().size;
    let aspectRatio = width / height;
    let recommenderDataAction: RecommenderDataActionType = {
      type: 'UPDATE_AR',
      key: 'aspectRatio',
      data: aspectRatio,
    };
    store.dispatch(recommenderDataAction);
  });
  return null;
}
