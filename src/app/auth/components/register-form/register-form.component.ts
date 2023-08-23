import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError, of } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import handlingError from 'src/app/utils/handling-error';
import { swalSuccess } from 'src/app/utils/app-util';
import { AuthService } from '../../services/auth.service';

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
    private readonly loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.buildForm();
    const user = this.authService.getUserFromStorage();

    if (user) {
      this.router.navigateByUrl('/products')
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
      .pipe(catchError(handlingError))
      .subscribe({
        next: res => {
          swalSuccess(res.message)
          this.router.navigateByUrl('/login');
        },
        error: (err) => alert(err),
        complete: () => this.loadingService.hideLoading()
      });
  }

}
