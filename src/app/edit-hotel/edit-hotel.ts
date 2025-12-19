import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Hotel } from '../models/hotel';
import { Hotelservice } from '../services/hotel.service';

@Component({
  selector: 'app-edit-hotel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-hotel.html',
})
export class EditHotel implements OnInit {
  hotelToModify = {} as Hotel;
  hotelId!: string; // Changed to string
  imagePreview: string | ArrayBuffer | null = null; // For image preview

  constructor(
    private hs: Hotelservice,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.hotelId = idParam; // Removed Number() conversion
      this.getHotelById();
    } else {
      // Hotel ID not found in route
      this.router.navigate(['/hotels']);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result; // For displaying preview
        this.hotelToModify.image = reader.result as string; // Store Base64 string
      };

      reader.readAsDataURL(file);
    } else {
      this.imagePreview = null;
      this.hotelToModify.image = '';
    }
  }

  getHotelById() {
    if (!this.hotelId) {
      console.error('Hotel ID is not set');
      return;
    }
    this.hs.getHotelById(this.hotelId).subscribe({
      next: (data: Hotel) => {
        this.hotelToModify = { ...data };
        this.hotelToModify.id = this.hotelId;
        this.imagePreview = this.hotelToModify.image; // Initialize preview with existing image
        // Hotel loaded
      },
      error: (err: any) => {
        // Error loading hotel
        alert('Error loading hotel. Please try again.');
      }
    });
  }

  modifyHotel() {
    if (!this.hotelId) {
      // Cannot update hotel: hotelId is not set
      alert('Error: Hotel ID is missing. Cannot update.');
      return;
    }

    const hotelToUpdate: Hotel = {
      id: this.hotelId,
      name: this.hotelToModify.name,
      city: this.hotelToModify.city,
      stars: this.hotelToModify.stars,
      description: this.hotelToModify.description,
      image: this.hotelToModify.image,
    
      // ✅ PRESERVE EXISTING STATUS
      status: this.hotelToModify.status || 'active'
    };
    

    // Updating hotel with ID
    // Hotel data to update

    this.hs.updateHotel(hotelToUpdate).subscribe({
      next: (response: Hotel) => {
        // Hotel updated successfully
        this.router.navigate(['/hotels']);
      },
      error: (err: any) => {
        // Error updating hotel
        // Error status
        // Error URL
        // Hotel ID
        // Hotel data
        alert(`Error updating hotel (${err.status}). Please check the console and ensure json-server is running.`);
      }
    });
  }

  cancel() {
    this.router.navigate(['/hotels']);
  }
}