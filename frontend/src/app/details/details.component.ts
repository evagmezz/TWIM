import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, RouterOutlet } from '@angular/router'
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  standalone: true,
  imports: [RouterOutlet],
})
export class DetailsComponent implements OnInit {
  post: any

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const postId = this.activatedRoute.snapshot.paramMap.get('id')
    if (postId) {
      this.authService.details(postId).subscribe((res) => {
        this.post = res
      })
    }
  }
}
