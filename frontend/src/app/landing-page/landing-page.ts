import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors } from '@angular/forms';

const URL_PATTERN = /^(https?:\/\/)?[^\s.]+(\.[^\s.]+)+[^\s]*$/i;

function urlValidator(control: AbstractControl<string>): ValidationErrors | null {
  const value = control.value.trim();

  if (!value) {
    return { required: true };
  }

  return URL_PATTERN.test(value) ? null : { invalidUrl: true };
}

@Component({
  selector: 'app-landing-page',
  imports: [ReactiveFormsModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  private readonly formBuilder = new FormBuilder();

  readonly urlControl = this.formBuilder.nonNullable.control('', [urlValidator]);

  submitted = false;

  constructor() {
    this.urlControl.valueChanges.subscribe(() => {
      this.submitted = false;
    });
  }

  onSubmit(): void {
    if (this.urlControl.invalid) {
      this.urlControl.markAsTouched();
      return;
    }

    this.submitted = true;
  }
}
