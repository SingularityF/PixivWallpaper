export const feedThumbnailUpdate = (key: number, data: string) => {
  return {
    type: 'THUMBNAIL_UPDATE',
    data: data,
    key: key,
  };
};

export const feedThumbnailReset = () => {
  return {
    type: 'THUMBNAIL_RESET'
  };
};