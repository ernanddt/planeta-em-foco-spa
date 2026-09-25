import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-recursos",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./recursos.component.html",
  styleUrls: ["./recursos.component.scss"],
})
export class RecursosComponent {}
