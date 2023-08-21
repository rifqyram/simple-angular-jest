import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { Observable, catchError } from 'rxjs';
import handlingError from 'src/app/utils/handling-error';
import CommonResponse from 'src/app/shared/models/ICommonResponse';
import { AuthResponse } from '../../models/IAuthModel';
import { swalSuccess } from 'src/app/utils/app-util';

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
    private readonly loadingService: LoadingService
  ) { }

  async ngOnInit(): Promise<void> {
    this.buildForm();
    const user = this.authService.getUserFromStorage();

    if (user) {
      this.router.navigateByUrl('/products')
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
    if (!this.form.valid) {
      this.loadingService.hideLoading();
      return;
    }

    const payload = this.form.value;
    this.authService.login(payload)
      .pipe(catchError(handlingError))
      .subscribe({
        next: (res: CommonResponse<AuthResponse>) => {
          this.authService.storeUser(res.data);
          swalSuccess(res.message);
          this.router.navigateByUrl('/products');
        },
        complete: () => this.loadingService.hideLoading()
      })
  }

}
