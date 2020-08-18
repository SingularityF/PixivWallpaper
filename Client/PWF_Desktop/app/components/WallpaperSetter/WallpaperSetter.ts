import { remote } from 'electron';

export async function setWallpaper(filePath: string, callback?: () => {}) {
  const setWallpaperFunction = remote.getGlobal('setWallpaper');
  await setWallpaperFunction(filePath);
  if (callback != null) callback();
}
