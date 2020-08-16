export default interface StoreData {
    feedTimer: number,
    feedDate: String,
    feedIllust: Array<IllustData>,
    feedDownload: { [key: number]: string }
};

export interface IllustData{
    Rank: number,
    IllustID: number
};
