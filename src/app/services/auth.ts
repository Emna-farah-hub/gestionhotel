import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public loggedUser!: string;
  public isloggedIn: boolean = false;
  private _roles = new BehaviorSubject<string[]>([]); //  permet aux composants de réagir automatiquement aux changements de rôles.
  private apiUrl = 'http://localhost:3000/users';

  constructor(private router: Router, private http: HttpClient) {}//httpclient=communication avec backend router=navigation

  logout() {
    this.isloggedIn = false;
    this.loggedUser = '';
    this._roles.next([]); // Reset roles to an empty array
    localStorage.removeItem('loggedUser');
    localStorage.setItem('isloggedIn', 'false');
    this.router.navigate(['/login']);
  }

  SignIn(user: User): Observable<boolean> {
    console.log('SignIn: Attempting to sign in with user:', user.username);
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        console.log('SignIn: Received users from API:', users);
        const foundUser = users.find(u => u.username === user.username && u.password === user.password);
        if (foundUser) {
          console.log('SignIn: User found!', foundUser);
          this.loggedUser = foundUser.username;
        this.isloggedIn = true;
          this._roles.next(foundUser.roles); // Update BehaviorSubject with roles
        localStorage.setItem('loggedUser', this.loggedUser);
          localStorage.setItem('isloggedIn', 'true');
          return true;
        } else {
          console.log('SignIn: Failed - User not found or incorrect credentials.');
          return false;
        }
      }),
      catchError(this.handleError)
    );
  }

  isAdmin(): Observable<boolean> {
    return this._roles.asObservable().pipe( //  asObservable() empêche les composants de modifier les rôles
      map(roles => {
        if (!roles || roles.length === 0) {
      return false;
        }
        const isAdminRole = (roles.indexOf('ADMIN') > -1);
        return isAdminRole;
      }),
      take(1) // Take only the first emission and complete
    );
  }

  setLoggedUserFromLocalStorage(login: string) {
    console.log('setLoggedUserFromLocalStorage: Setting logged user:', login);
    this.loggedUser = login;
    this.isloggedIn = true;
    this.getUserRoles(login).subscribe(roles => {
      this._roles.next(roles);
    });
  }

  getUserRoles(username: string): Observable<string[]> {
    console.log('getUserRoles: Fetching roles for user:', username);
    return this.http.get<User[]>(`${this.apiUrl}?username=${username}`).pipe(
      map(users => {
        const user = users[0];
        if (user && user.roles) {
          return user.roles;
        } else {
          return [];
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
