export interface Hotel {
  id: string;
  name: string;
  city: string;
  stars: number;
  description: string;
  image: string;
  status: 'active' | 'inactive'; 
}