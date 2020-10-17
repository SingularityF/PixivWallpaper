import path from 'path';
import fs from 'fs';
import { remote } from 'electron';
import { downloadFolder } from '../../constants/defaultConfigs.json';
import axios from 'axios';
const mkdirp = require('mkdirp');
const getSize = require('get-folder-size');

export async function createFolder(folderPath: string) {
  await mkdirp(folderPath);
  return;
}

export function getFolderSize(callback: any) {
  getSize(getDownloadFolder(), (err, size) => {
    if (err) {
      throw err;
    }
    let sizeString = (size / 1024 / 1024).toFixed(2) + ' MB';
    callback(sizeString);
  });
}

export function getDownloadFolder() {
  return path.resolve(remote.app.getPath('userData'), downloadFolder);
}

export function showDownloadFolder() {
  remote.shell.showItemInFolder(
    path.resolve(remote.app.getPath('userData'), downloadFolder)
  );
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
      let filePath = makePath(illustID, feedDate, type, ext)
      saveImage(filePath, Buffer.from(res.data), callback);
    });
}

export function makePath(illustID: number, feedDate: string, type:string, ext: string){
  let folderPath = path.resolve(
    remote.app.getPath('userData'),
    `WallpaperDownloads/${feedDate}/${type}/`
  );
  let filePath = path.resolve(folderPath, `${illustID}.${ext}`);
  return filePath;
}

export async function saveImage(filePath: string, imgData: Buffer, callback: any) {
  let folderPath = path.dirname(filePath);
  await createFolder(folderPath);
  fs.writeFileSync(filePath, imgData, 'binary');
  callback(filePath);
}
