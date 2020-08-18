export default interface StoreData {
  appInitialized: boolean;
  feedTimer: number;
  feedDate: string;
  feedIllust: Array<IllustData>;
  feedThumbnail: { [key: number]: string };
}

export interface IllustData {
  Rank: number;
  IllustID: number;
}
