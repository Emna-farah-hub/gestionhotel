import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Removed RouterLink
import { Hotel } from '../models/hotel';
import { Hotelservice } from '../services/hotel.service';
import { AuthService } from '../services/auth';
import { RoomList } from '../rooms/room-list/room-list'; // To embed the room list

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule, NgIf, RoomList], // Import RoomList to display rooms
  templateUrl: './hotel-details.html',
  styleUrls: ['./hotel-details.css']
})
export class HotelDetailsComponent implements OnInit {
  hotel: Hotel | undefined;
  hotelId!: string; // Changed to string

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: Hotelservice,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.hotelId = idParam; // Removed + operator
        this.getHotelDetails(this.hotelId);
      }
    });
  }

  getHotelDetails(id: string): void {
    this.hotelService.getHotelById(id).subscribe({
      next: (data) => {
        this.hotel = data;
      },
      error: (err) => {
        console.error('Error fetching hotel details:', err);
        this.router.navigate(['/hotels']); // Redirect if hotel not found
      }
    });
  }

  editHotel(): void {
    if (this.hotel) {
      this.router.navigate([`/hotels/edit/${this.hotel.id}`]);
    }
  }

  deleteHotel(): void {
    if (this.hotel && confirm('Are you sure you want to delete this hotel?')) {
      this.hotelService.deleteHotel(this.hotel.id).subscribe({
        next: () => {
          this.router.navigate(['/hotels']);
        },
        error: (err) => {
          console.error('Error deleting hotel:', err);
          alert('Failed to delete hotel. Please try again.');
        }
      });
    }
  }

  addRoomToHotel(): void {
    if (this.hotel) {
      this.router.navigate([`/hotels/${this.hotel.id}/add-room`]);
    }
  }
  
  
  // Note: The RoomList component will handle displaying rooms for this hotel automatically
  // as it also subscribes to route params for hotelId.
}