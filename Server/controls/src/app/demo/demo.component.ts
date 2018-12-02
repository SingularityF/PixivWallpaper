import { Component, OnInit } from '@angular/core';
import { DemoService } from '../demo.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})

export class DemoComponent implements OnInit {
  showAlert: boolean;
  pixivLink: string;
  imageLocation: string;
  aspectRatio: number;
  imageLoading: boolean;
  illustID: string;

  constructor(private demoService: DemoService) { }

  loadBestMatch(widthInput, heightInput) {
    if (widthInput == parseInt(widthInput) && heightInput == parseInt(heightInput)) {
      this.showAlert = false;
      this.aspectRatio = parseInt(widthInput) / parseInt(heightInput);
      this.getSet();
    } else {
      this.showAlert = true;
    }
    return false;
  }

  getSet() {
    this.reloadImage();
    this.refreshLink();
  }

  reloadImage() {
    this.imageLoading = true;
    this.imageLocation = "https://singf.space/pixiv/select_paper.php?demo=yes&ar=" + this.aspectRatio;
  }

  infoCallback(data: returnData) {
    this.illustID = data["IllustID"];
    this.pixivLink = "https://www.pixiv.net/member_illust.php?mode=medium&illust_id=" + this.illustID;
  }

  refreshLink() {
    this.demoService.getIllustInfo(this.aspectRatio)
      .subscribe((data: returnData) => this.infoCallback(data)
      );
  }

  ngOnInit() {
    this.aspectRatio = 16 / 9;
    this.getSet()
  }

}

interface returnData {
  IllustID: string;
}