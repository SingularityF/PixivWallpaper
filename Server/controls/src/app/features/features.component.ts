import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {

  constructor(private meta: Meta, private title: Title) { }

  ngOnInit() {
    document.getElementById("nav_feature").className += " active";
    this.meta.addTag({ name: "Description", content: "PixivWallpaper is a Windows application that delivers illustrations from Pixiv Daily Rankings to your desktop every day. It comes with a smart selection algorithm that automatically picks the best looking illustration for your screen." });
    this.title.setTitle("PixivWallpaper - Daily Top Wallpapers on Pixiv");
  }

}
