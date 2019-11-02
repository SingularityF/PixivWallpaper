import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PickerService {
  requestUrl = "https://singf.space/pixiv/pick_paper.php";

  constructor(private http: HttpClient) { }

  public setWallpaper(uuid: string, illustID: string, timestamp: string) {
    return this.http.post(this.requestUrl, { uuid: uuid, illustID: illustID, timestamp: timestamp }, { responseType: 'text' });
  }
}
