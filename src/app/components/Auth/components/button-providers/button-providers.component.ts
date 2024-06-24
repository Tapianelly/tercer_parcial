import { NgOptimizedImage } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthServiceService } from '../../../../core/services/auth/auth.service.service';

export type Provider = 'github' | 'google';

@Component({
  standalone: true,
  imports: [NgOptimizedImage],
  selector: 'app-button-providers',
  templateUrl: './button-providers.component.html',
  styleUrls: ['./button-providers.component.scss'],
})
export class ButtonProviders {
  @Input() isLogin = false;

  private _authService = inject(AuthServiceService);
  private _router = inject(Router);

  providerAction(provider: Provider): void {
    if (provider === 'google') {
      this.signUpWithGoogle();
    } else {
      this.signUpWithGithub();
    }
  }

  async signUpWithGoogle(): Promise<void> {
    try {
      const result = await this._authService.signInWithGoogleProvider();
      this._router.navigateByUrl('/dashboard/gallery');
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  async signUpWithGithub(): Promise<void> {
    try {
      const result = await this._authService.signInWithGithubProvider();
      this._router.navigateByUrl('/dashboard/gallery');
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}