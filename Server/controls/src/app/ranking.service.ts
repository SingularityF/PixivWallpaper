import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  requestUrl = "https://singf.space/pixiv/ranking_gallery.php";
  
  constructor(private http: HttpClient) { }

  public fetchGallery() {
    return this.http.get(this.requestUrl);
  }
}
