import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onSubmit(): void {
    // ...
  }
}
