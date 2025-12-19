import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { CommonModule } from '@angular/common'; // Ensure this is imported

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './room-form.html',
})
export class RoomForm implements OnInit {
  room: Room = {
    id: '', // Changed to string
    roomNumber: '',
    price: 0,
    available: true,
    type: '',
    capacity: 0,
    image: '',
    hotelId: '',
     // Changed to string
  };
  isEditMode = false;
  hotelIdFromRoute!: string; // Changed to string
  imagePreview: string | ArrayBuffer | null = null; // For image preview

  constructor(
    private rs: RoomService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const editRoomId = params.get('id');

      if (editRoomId && this.router.url.includes('/rooms/edit/')) {
        this.isEditMode = true;
        this.room.id = editRoomId;
        this.loadRoom(this.room.id);
      } else if (this.router.url.includes('/hotels/') && this.router.url.includes('/add-room')) {
        const addRoomHotelId = params.get('id');
        if (addRoomHotelId) {
          this.isEditMode = false;
        this.hotelIdFromRoute = addRoomHotelId;
        this.room.hotelId = this.hotelIdFromRoute;
        // Ensure id is not sent for new rooms so json-server auto-generates it
        this.room.id = undefined;
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result; // For displaying preview
        this.room.image = reader.result as string; // Store Base64 string
      };

      reader.readAsDataURL(file);
    } else {
      this.imagePreview = null;
      this.room.image = '';
    }
  }

  loadRoom(id: string) {
    this.rs.getRoomById(id).subscribe((data: Room) => {
      this.room = data;
      this.imagePreview = this.room.image; // Initialize preview with existing image
    });
  }

  saveRoom() {
    if (this.isEditMode) {
      this.rs.updateRoom(this.room).subscribe(() => {
        // After updating a room, navigate back to the specific hotel's room list.
        // Ensure `this.room.hotelId` is correctly set here.
        this.router.navigate([`/hotels/${this.room.hotelId}`]);
      });
    } else {
      this.room.hotelId = this.hotelIdFromRoute;
    
      // ✅ SAFETY DEFAULTS (only for new rooms)
      if (this.room.available === undefined) {
        this.room.available = true;
      }
      if (!this.room.price) {
        this.room.price = 100;
      }
    
      this.rs.addRoom(this.room).subscribe(() => {
        this.router.navigate([`/hotels/${this.room.hotelId}`]);
      });
    }
    
  }

  cancel() {
    if (this.room.hotelId) {
      this.router.navigate([`/hotels/${this.room.hotelId}`]);
    } else {
      this.router.navigate(['/hotels']);
    }
  }
}