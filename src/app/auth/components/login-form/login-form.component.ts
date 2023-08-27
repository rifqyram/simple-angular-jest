import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError } from 'rxjs';
import ICommonResponse from 'src/app/shared/models/ICommonResponse';
import { AuthResponse } from '../../models/IAuthModel';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  form!: FormGroup;
  isLoading: Observable<boolean> = this.loadingService.loading;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly loadingService: LoadingService,
    private readonly utilService: UtilService,
  ) { }

  async ngOnInit() {
    this.buildForm();
    this.fetchUser();
  }

  fetchUser() {
    const user = this.authService.getUserFromStorage();
    if (user) {
      this.router.navigate(['/products']);
    }
  }

  buildForm() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.min(8)])
    });
  }

  submit() {
    this.loadingService.showLoading();
    if (!this.form || this.form.invalid) {
      this.loadingService.hideLoading();
      return;
    }

    const payload = this.form.value;
    this.authService.login(payload)
      .pipe(catchError(err => this.utilService.handleHttpError(err)))
      .subscribe({
        next: (res: ICommonResponse<AuthResponse>) => {
          this.authService.storeUser(res.data);
          this.utilService.swalSuccess(res.message);
          this.loadingService.hideLoading()
          this.router.navigate(['/products']);
        },
      })
  }

}
