import {Component, OnInit} from '@angular/core';
import {User} from "../models/user";
import {AuthService} from "../services/auth.service";
import {TableModule} from "primeng/table";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    TableModule,
    NgForOf
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  users: User[]

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {

  }
}
