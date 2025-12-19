import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './services/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const hotelGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin().pipe(
    map(isAdmin => {
      if (isAdmin) {
        return true;
      } else {
        return router.createUrlTree(['forbidden']);
      }
    })
  );
};