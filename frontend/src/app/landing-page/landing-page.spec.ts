import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPage } from './landing-page';

describe('LandingPage', () => {
  let component: LandingPage;
  let fixture: ComponentFixture<LandingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function submitButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[type="submit"]');
  }

  function feedbackText(): string {
    return fixture.nativeElement.textContent;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the wordmark', () => {
    expect(feedbackText()).toContain('URL Shortener');
  });

  it('starts with the submit button disabled and no feedback message', () => {
    expect(submitButton().disabled).toBeTrue();
    expect(feedbackText()).not.toContain('Enter a URL to shorten');
    expect(feedbackText()).not.toContain("doesn't look like a valid URL");
    expect(feedbackText()).not.toContain("isn't live yet");
  });

  it('shows a required error for empty/whitespace input once touched', () => {
    component.urlControl.setValue('   ');
    component.urlControl.markAsTouched();
    fixture.detectChanges();

    expect(feedbackText()).toContain('Enter a URL to shorten');
    expect(submitButton().disabled).toBeTrue();
  });

  it('shows a format error for an implausible URL once touched', () => {
    component.urlControl.setValue('not a url');
    component.urlControl.markAsTouched();
    fixture.detectChanges();

    expect(feedbackText()).toContain("doesn't look like a valid URL");
    expect(submitButton().disabled).toBeTrue();
  });

  it('enables the button for a valid URL', () => {
    component.urlControl.setValue('https://example.com');
    fixture.detectChanges();

    expect(component.urlControl.valid).toBeTrue();
    expect(submitButton().disabled).toBeFalse();
  });

  it('shows the placeholder note after submitting a valid URL', () => {
    component.urlControl.setValue('https://example.com');
    fixture.detectChanges();

    component.onSubmit();
    fixture.detectChanges();

    expect(feedbackText()).toContain("isn't live yet");
  });

  it('clears the placeholder note when the input is edited again', () => {
    component.urlControl.setValue('https://example.com');
    component.onSubmit();
    fixture.detectChanges();
    expect(feedbackText()).toContain("isn't live yet");

    component.urlControl.setValue('https://example.org');
    fixture.detectChanges();

    expect(feedbackText()).not.toContain("isn't live yet");
  });
});
