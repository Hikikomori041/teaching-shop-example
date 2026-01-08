export interface Review {
  id: number;
  product: number;
  author: string;
  rating: number;
  comment: string;
  created_at: string;
}

export async function fetchReviews(): Promise<Review[]> {
  const response = await fetch("http://localhost:8000/api/reviews/");
  return response.json();
}