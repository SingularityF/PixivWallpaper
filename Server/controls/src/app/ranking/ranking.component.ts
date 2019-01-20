import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RankingService } from '../ranking.service';
import { PickerService } from '../picker.service';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  artworks: returnData[];
  selectMode: boolean = false;
  selectedRank: number = -1;
  uuid: string;
  requestPending: boolean = false;
  modalMessage: string;

  constructor(private modalService: NgbModal, private rankingService: RankingService, private pickerService: PickerService, private route: ActivatedRoute) { }

  ajaxCallback(data: returnData[]) {
    this.artworks = data;
  }

  open(content) {
    this.modalService.open(content, { centered: true });
  }

  setWallpaper(illustID: string, timestamp: string) {
    this.requestPending = true;
    this.modalMessage = "";
    this.pickerService.setWallpaper(this.uuid, illustID, timestamp)
      .subscribe((data) => {
        if (data == "successful") {
          this.requestPending = false;
          this.modalMessage = "Wallpaper was set successfully, get wallpaper from your desktop client again to see the change.";
        } else {
          this.requestPending = false;
          this.modalMessage = "Request failed, try again later or try updating the client.";
        }
      }
      );
  }

  ngOnInit() {
    document.getElementById("nav_rank").className += " active";

    this.route.params.subscribe(params => {
      if (typeof params["uuid"] != "undefined") {
        this.selectMode = true;
        this.uuid = params["uuid"];
      }
    });

    this.rankingService.fetchGallery()
      .subscribe((data: returnData[]) => this.ajaxCallback(data)
      );
  }

}

interface returnData {
  ImageID: string;
  Width: string;
  Height: string;
  AspectRatio: string;
  CheckSum: string;
  Entropy: string;
  AvgGradient: string;
  Variance: string;
  Format: string;
  DateCreated: string;
  Type: string;
  IllustID: string;
  Ranking: string;
  TimeStamp: string;
  OrigWidth: string;
  OrigHeight: string;
}