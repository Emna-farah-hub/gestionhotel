import { Routes } from '@angular/router';
import { HotelList } from './hotel-list/hotel-list';
import { AddHotel } from './add-hotel/add-hotel';
import { EditHotel } from './edit-hotel/edit-hotel';
import { Login } from './login/login';
import { RoomList } from './rooms/room-list/room-list';
import { RoomForm } from './rooms/room-form/room-form';
import { RoomDetails } from './rooms/room-details/room-details';
import { ProfileComponent } from './profile/profile';
import { HotelDetailsComponent } from './hotel-details/hotel-details'; // Added this import

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: '', redirectTo: 'hotels', pathMatch: 'full' },
    { path: 'hotels', component: HotelList },
    { path: 'hotels/add', component: AddHotel },
    { path: 'hotels/edit/:id', component: EditHotel },
    { path: 'hotels/:id', component: HotelDetailsComponent },
    { path: 'hotels/:id/add-room', component: RoomForm },
    { path: 'rooms/edit/:id', component: RoomForm },
    { path: 'profile', component: ProfileComponent },
    { path: 'rooms/list', component: RoomList },
    { path: 'rooms/:id', component: RoomDetails } // Added for RoomDetailsComponent
];
