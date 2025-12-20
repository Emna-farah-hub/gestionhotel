import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Hotel } from '../models/hotel';
import { Hotelservice } from '../services/hotel.service';

@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-hotel.html',
})
export class AddHotel {
  newHotel = {} as Hotel;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private hs: Hotelservice, private router: Router) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;//Récupère le champ <input type="file">.//
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result;
        this.newHotel.image = reader.result as string;
      };

      reader.readAsDataURL(file);//Convertit l’image en Base64 pour l’envoyer à JSON Server.//
    } else {
      this.imagePreview = null;
      this.newHotel.image = '';
    }
  }

  addHotel() {
    // ✅ DEFAULT STATUS FOR NEW HOTELS
    this.newHotel.status = 'active';

    this.hs.addHotel(this.newHotel).subscribe(() => {
      this.router.navigate(['/hotels']);
    });//Envoie l’hôtel au backend via le service. 
  }

  cancel() {
    this.router.navigate(['/hotels']);
  }
}
