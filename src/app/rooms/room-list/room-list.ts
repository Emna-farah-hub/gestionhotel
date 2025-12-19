import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './room-list.html',
})
export class RoomList implements OnInit {
  rooms: Room[] = [];
  allRooms: Room[] = []; // ✅ keep original list for filtering

  availabilityFilter: 'all' | 'available' | 'unavailable' = 'all';

  @Input() hotelIdFromParent: string | undefined;

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const routeIdParam = params.get('id');

      if (this.hotelIdFromParent) {
        this.getRoomsByHotel(this.hotelIdFromParent);
      } else if (routeIdParam) {
        this.getRoomsByHotel(routeIdParam);
      } else {
        this.getAllRooms();
      }
    });
  }

  getAllRooms(): void {
    this.roomService.getRooms().subscribe((data: Room[]) => {
      this.allRooms = data;
      this.applyAvailabilityFilter();
    });
  }

  getRoomsByHotel(hotelId: string) {
    this.roomService.getRoomsByHotelId(hotelId).subscribe((data: Room[]) => {
      this.allRooms = data;
      this.applyAvailabilityFilter();
    });
  }

  applyAvailabilityFilter() {
    if (this.availabilityFilter === 'all') {
      this.rooms = [...this.allRooms];
    } else if (this.availabilityFilter === 'available') {
      this.rooms = this.allRooms.filter(r => r.available);
    } else {
      this.rooms = this.allRooms.filter(r => !r.available);
    }
  }

  toggleAvailability(room: Room) {
    room.available = !room.available;
    this.roomService.updateRoom(room).subscribe();
  }

  updatePrice(room: Room) {
    this.roomService.updateRoom(room).subscribe();
  }

  deleteRoom(id: string) {
    if (confirm('Are you sure you want to delete this room?')) {
      this.roomService.deleteRoom(id).subscribe(() => {
        if (this.hotelIdFromParent) {
          this.getRoomsByHotel(this.hotelIdFromParent);
        } else {
          this.getAllRooms();
        }
      });
    }
  }

  viewRoomDetails(id: string | undefined): void {
    if (id) {
      this.router.navigate([`/rooms/${id}`]);
    }
  }
}
