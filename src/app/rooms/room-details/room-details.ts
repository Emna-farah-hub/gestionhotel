import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth'; // Import AuthService

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [CommonModule, RouterLink], // Removed RouterLink
  templateUrl: './room-details.html',
  styleUrls: ['./room-details.css'] // Assuming a CSS file for styling
})
export class RoomDetails implements OnInit {
  room!: Room;

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute,
    private router: Router, // Inject Router
    public authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.getRoomDetails(idParam); // Removed + operator
      }
    });
  }

  getRoomDetails(id: string) {
    this.roomService.getRoomById(id).subscribe((data: Room) => {
      this.room = data;
    });
  }

  editRoom(): void {
    if (this.room) {
      this.router.navigate([`/rooms/edit/${this.room.id}`]);
    }
  }

  // room-details.ts

// Inside RoomDetails component (room-details.ts)
deleteRoom(): void {
  if (this.room && this.room.id && confirm('Are you sure you want to delete this room?')) {
    this.roomService.deleteRoom(this.room.id).subscribe({
      next: () => {
        // SUCCESS: Redirect back to the hotel's room list
        this.router.navigate([`/hotels/${this.room.hotelId}`]); 
      },
      error: (err) => {
        console.error('Error deleting room:', err);
        alert('Failed to delete room. Please try again.');
      }
    });
  }
}
}