import { useState, useEffect } from 'react';
import { Review, fetchReviews } from '../api/reviews';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews().then(setReviews);
  }, []);

  if (reviews.length === 0) return null;

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Avis clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">{review.author}</span>
                <span className="text-yellow-500">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}