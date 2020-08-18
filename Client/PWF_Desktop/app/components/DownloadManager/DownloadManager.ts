import path from 'path';
import fs from 'fs';
import { remote } from 'electron';
import { downloadFolder } from '../../constants/defaultConfigs.json';
import axios from 'axios';
const mkdirp = require('mkdirp');

export async function createFolder(folderPath: string) {
  await mkdirp(folderPath);
  return;
}

export async function clearDownloads() {
  let folderPath = path.resolve(remote.app.getPath('userData'), downloadFolder);
  fs.rmdirSync(folderPath, { recursive: true });
}

export function isDownloaded(illustID: number, feedDate: string) {
  let folderPath = path.resolve(
    remote.app.getPath('userData'),
    downloadFolder,
    feedDate,
    'original'
  );
  if (fs.existsSync(folderPath)) {
    let files = fs.readdirSync(folderPath);
    let fileBasenames = files.map((file) => file.split('.')[0]);
    if (fileBasenames.includes(illustID.toString())) return true;
  }
  return false;
}

export function downloadImage(
  url: string,
  illustID: number,
  feedDate: string,
  type: string,
  callback: any
) {
  axios
    .get(url, {
      responseType: 'arraybuffer',
    })
    .then(async (res) => {
      let ext = res['headers']['content-type'].split('/')[1];
      let folderPath = path.resolve(
        remote.app.getPath('userData'),
        `WallpaperDownloads/${feedDate}/${type}/`
      );
      let filePath = path.resolve(folderPath, `${illustID}.${ext}`);
      await createFolder(folderPath);
      fs.writeFileSync(filePath, Buffer.from(res.data), 'binary');
      callback(filePath);
    });
}
