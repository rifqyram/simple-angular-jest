import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {
  form!: FormGroup;
  isLoading: Observable<boolean> = this.loadingService.loading;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly loadingService: LoadingService,
    private readonly utilService: UtilService,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.fetchUserInfo();
  }

  fetchUserInfo() {
    const user = this.authService.getUserFromStorage();

    if (user) {
      this.router.navigate(['/products']).finally;
    }
  }

  buildForm() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.min(8)]),
    })
  }

  submit() {
    this.loadingService.showLoading();

    if (!this.form.valid) {
      this.loadingService.hideLoading()
      return;
    }

    const payload = this.form.value;
    this.authService.register(payload)
      .pipe(catchError(err => this.utilService.handleHttpError(err)))
      .subscribe({
        next: res => {
          this.utilService.swalSuccess(res.message)
          this.router.navigate(['/login']).finally;
        },
        complete: () => this.loadingService.hideLoading()
      });
  }

}
