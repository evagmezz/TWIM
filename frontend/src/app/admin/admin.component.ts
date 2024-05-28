import {Component, OnInit} from '@angular/core'
import {User} from "../models/user"
import {AuthService} from "../services/auth.service"
import {TableModule} from "primeng/table"
import {ButtonModule} from "primeng/button"
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms"
import {DialogModule} from "primeng/dialog"
import {DropdownModule} from "primeng/dropdown"
import {NgStyle} from "@angular/common"
import {InputTextModule} from "primeng/inputtext"
import {ConfirmationService, ConfirmEventType} from "primeng/api"
import {ConfirmDialogModule} from "primeng/confirmdialog"
import {Role} from "../models/roles"

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    DropdownModule,
    NgStyle,
    InputTextModule,
    ConfirmDialogModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  users: User[]
  visibleEdit: boolean = false
  selectedUser: User
  role: Role[] | undefined


  constructor(private authService: AuthService, private fb: FormBuilder, private confirmationService: ConfirmationService) {
  }

  editUserForm = this.fb.group({
    role: ['', [Validators.required]]
  })


  ngOnInit(): void {
    this.authService.getUsersPaginate().subscribe((data) => {
      this.users = data.data
    })
    this.role = [
      {name: 'admin'},
      {name: 'user'}
    ]
  }

  selectUserForEdit(user: User) {
    this.selectedUser = user
    this.editUserForm.patchValue({
      role: this.selectedUser.role
    })
  }

  editUser() {
    if (!this.selectedUser || !this.selectedUser.role) {
      console.error('User or user role is undefined')
      return
    }

    const newRole = this.editUserForm.controls.role.value as string
    this.authService.updateUser(this.selectedUser.id, newRole).subscribe((updatedUser) => {
      this.visibleEdit = false
    })
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar a este usuario?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        this.authService.deleteUser(user.id).subscribe(() => {
          this.users = this.users.filter(u => u.id !== user.id)
        })
      },
      reject: (type: ConfirmEventType) => {
        if (type === ConfirmEventType.REJECT) {
        }
      }
    })
  }
}
