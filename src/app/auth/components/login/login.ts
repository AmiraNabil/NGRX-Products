import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  readonly store = inject(AuthStore);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  showPassword: boolean = false;

  form = this.fb.group({
    email: ['john@mail.com', [Validators.required, Validators.email]],
    password: ['changeme', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    effect(() => {
      if (this.store.isLoggedIn()) {
        this.router.navigate(['/products']);
      }
    });
  }

  get loading() {
    return this.store.loading();
  }
  get error() {
    return this.store.error();
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c.touched);
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (!c?.errors) return '';
    if (c.errors['required']) return 'This field is required';
    if (c.errors['email']) return 'Please enter a valid email';
    if (c.errors['minlength']) return `Minimum ${c.errors['minlength'].requiredLength} characters`;
    return '';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.store.login({
      email: this.form.value.email!,
      password: this.form.value.password!,
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
