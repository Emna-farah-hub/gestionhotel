import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Room } from '../models/room';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}
  api = 'http://localhost:3000/rooms';

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

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.api)
      .pipe(
        catchError(this.handleError)
      );
  }
  getRoomById(id: string): Observable<Room> {
    return this.http.get<Room>(`${this.api}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  getRoomsByHotelId(hotelId: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.api}?hotelId=${hotelId}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  deleteRoom(id: string) {
    return this.http.delete<Room>(`${this.api}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  addRoom(room: Room): Observable<Room> {
    console.log('RoomService: Attempting to add room:', room);
    return this.http.post<Room>(this.api, room)
      .pipe(
        catchError(this.handleError)
      );
  }
  updateRoom(room: Room): Observable<Room> {
    const roomId = room.id;
    const updateUrl = `${this.api}/${roomId}`;
    const roomToUpdate = { ...room, id: roomId };
    return this.http.put<Room>(updateUrl, roomToUpdate)
      .pipe(
        catchError(this.handleError)
      );
  }
}