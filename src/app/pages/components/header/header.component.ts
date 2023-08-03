import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-header', templateUrl: './header.component.html', styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle?: string;
  @Input() pageInfos!: { name: string, data: number }[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
