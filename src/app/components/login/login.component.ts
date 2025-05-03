import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private jwtHelper = new JwtHelperService();

  currentUsername?: string;
  logged: boolean = false;

  @Output() role = new EventEmitter<number>;

  constructor(public dialog: MatDialog, private authService: AuthenticationService, private router: Router) { }

  
  ngOnInit(): void {
    if (this.authService.expiredRefToken()) {
      this.logout();
    }
    this.setCurrentUsername();
  }

  logout() {
    this.authService.logout();
    this.logged = false;
    this.role.emit(5);
  }

  setCurrentUsername() {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.currentUsername = decodedToken.sub.username;
      this.role.emit(decodedToken.sub.role_id);
      this.logged = true;
    } else this.logout();
  }

  openLogin() {
    const dialog = this.dialog.open(DialogLogin, {
        width: '650px'
    });

    dialog.afterClosed().subscribe(() => {
      this.setCurrentUsername();
    })
  }

  openReg() {
    const dialog = this.dialog.open(RegisterDialogComponent, {
        width: '650px'
    });

    dialog.afterClosed().subscribe((data) => {
      console.log(data);
      this.authService.login(data.username, data.password).subscribe({
        next: (tokens) => {
          if (tokens && tokens.access_token) {
            localStorage.setItem('access_token', tokens.access_token);
            localStorage.setItem('refresh_token', tokens.refresh_token);
            this.setCurrentUsername();
          }
        }, error: (error) => {
          console.log(error);
          this.setCurrentUsername();
        }
      });
    })
  }
}

@Component({
  selector: 'dialog-login',
  templateUrl: 'login-dialog.html',
  styleUrls: ['login.component.css']
})
export class DialogLogin {

  loginForm: FormGroup;
  loginErrorMsg = "";

  constructor(public dialogRef: MatDialogRef<DialogLogin>,
    private fb: FormBuilder, private authService: AuthenticationService) { 
      this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
    }

  login() {
    if (this.loginForm.valid) {
        this.authService.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value).subscribe({
          next: (tokens) => {
            if (tokens && tokens.access_token) {
              localStorage.setItem('access_token', tokens.access_token);
              localStorage.setItem('refresh_token', tokens.refresh_token);
              this.dialogRef.close();
            }
          }, error: (error) => {
            this.loginErrorMsg = "Invalid credentials.";
            console.log(error);
          }
        });
      }
  }
}

@Component({
  selector: 'register-dialog',
  templateUrl: 'register-dialog.html',
  styleUrls: ['login.component.css']
})
export class RegisterDialogComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisterDialogComponent>,
    private authService: AuthenticationService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  register() {
    if (this.registerForm.valid)
      this.authService.register({"username" : this.registerForm.controls['username'].value,
    "email": this.registerForm.controls['email'].value,
    "password":  this.registerForm.controls['password'].value}).subscribe({
        next: () => {
          this.dialogRef.close(this.registerForm.value);
        }, error: (error) => {
        console.log(error);
      }
      });
  }
}