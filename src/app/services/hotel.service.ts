import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Hotel } from '../models/hotel';

@Injectable({
  providedIn: 'root',
})
export class Hotelservice {
  constructor( private http: HttpClient ) {}
  api = 'http://localhost:3000/hotels';

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      // console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      // console.error(
    //   `Backend returned code ${error.status}, ` +
    //   `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.api)
      .pipe(
        catchError(this.handleError)
      );
  }
  getHotelById(id: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.api}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  deleteHotel(id: string) {
    return this.http.delete<Hotel>(`${this.api}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  addHotel(hotel: Hotel) {
    return this.http.post<Hotel>(this.api, hotel)
      .pipe(
        catchError(this.handleError)
      );
  }
  updateHotel(hotel: Hotel) {
    const hotelId = hotel.id;
    const updateUrl = `${this.api}/${hotelId}`;
    const hotelToUpdate = { ...hotel, id: hotelId };
    return this.http.put<Hotel>(updateUrl, hotelToUpdate)
      .pipe(
        catchError(this.handleError)
      );
  }
}