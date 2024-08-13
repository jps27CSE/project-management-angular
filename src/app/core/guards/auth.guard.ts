import { CanActivate, CanActivateFn, Router } from '@angular/router';
// import { LocalStorageService } from '../localStorage/local-storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private router: Router,
    // private getToken: LocalStorageService,
  ) {}

  canActivate(): boolean {
    // const token = this.getToken.getToken();

    if (token) {
      return true;
    } else {
      this.router.navigate(['auth', '/login']);
      return false;
    }
  }
}
