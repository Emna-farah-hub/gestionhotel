import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Hotel } from '../models/hotel';
import { Hotelservice } from '../services/hotel.service';
import { AuthService } from '../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel-list.html',
})
export class HotelList implements OnInit {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  searchTerm: string = '';
  filterCity: string = '';
  filterStars: number | null = null;

  constructor(
    public hs: Hotelservice,              // ✅ must be public (used in template)
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllHotels();
  }

  getAllHotels() {
    this.hs.getHotels().subscribe((data: Hotel[]) => {
      this.hotels = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredHotels = this.hotels.filter(hotel => {
      const matchesSearchTerm = hotel.name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());

      const matchesCity = this.filterCity
        ? hotel.city.toLowerCase().includes(this.filterCity.toLowerCase())
        : true;

      const matchesStars = this.filterStars
        ? hotel.stars === this.filterStars
        : true;

      return matchesSearchTerm && matchesCity && matchesStars;
    });
  }

  deleteHotel(id: string) {
    if (confirm('Are you sure you want to delete this hotel?')) {
      this.hs.deleteHotel(id).subscribe(() => {
        this.getAllHotels();
      });
    }
  }

  viewHotelDetails(id: string) {
    this.router.navigate([`/hotels/${id}`]);
  }

  viewRooms(hotelId: string) {
    this.router.navigate([`/hotels/${hotelId}`]);
  }

  // ✅ STATUS TOGGLE (USED BY HTML)
  toggleStatus(hotel: Hotel): void {
    hotel.status = hotel.status === 'active' ? 'inactive' : 'active';
    this.hs.updateHotel(hotel).subscribe();
  }
}
