export interface Room {
  id: string | undefined;
  roomNumber: string;
  price: number;
  type: string;
  capacity: number;
  image: string;
  hotelId: string;
  available: boolean;
}