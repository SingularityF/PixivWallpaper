export const feedDownloadThumbnailUpdate = (key: number, data: String) => {
  return {
    type: 'THUMBNAIL_UPDATE',
    data: data,
    key: key,
  };
};
