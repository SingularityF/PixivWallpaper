import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DemoService {
  requestUrl = "https://singf.space/pixiv/select_paper.php?demo=yes&info=yes&ar=";

  constructor(private http: HttpClient) {
  }

  public getIllustInfo(aspectRatio) {
    let fullUrl = this.requestUrl + aspectRatio;
    return this.http.get(fullUrl);
  }
}
