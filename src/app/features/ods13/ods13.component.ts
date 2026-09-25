import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ViewportScroller } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-ods13",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./ods13.component.html",
  styleUrls: ["./ods13.component.scss"],
})
export class Ods13Component implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
  ) {}

  ngOnInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    });
  }
}
