import { Component, OnInit } from '@angular/core';
import { RankingService } from '../ranking.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  artworks: returnData[];

  constructor(private rankingService: RankingService) { }

  ajaxCallback(data: returnData[]) {
    this.artworks = data;
  }

  ngOnInit() {
    document.getElementById("nav_rank").className += " active";

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
}