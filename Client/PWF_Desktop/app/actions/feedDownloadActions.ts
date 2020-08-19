export const feedDownloadUpdate = (key: number, data: string) => {
  return {
    type: 'DOWNLOAD_UPDATE',
    data: data,
    key: key,
  };
};

export const feedDownloadReset = () => {
  return {
    type: 'DOWNLOAD_RESET',
  };
};
