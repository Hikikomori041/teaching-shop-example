import { useState, useEffect } from 'react';
import { type Carrier, fetchCarriers } from '../api/carriers';

export default function ShippingSection() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);

  useEffect(() => {
    fetchCarriers().then(setCarriers);
  }, []);

  if (carriers.length === 0) return null;

  return (
    <div className="bg-green-100 text-green-800 py-6 mb-8">
      <div className="max-w-4xl mx-auto px-8">
        <h2 className="text-lg font-semibold mb-4">Livraison</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {carriers.map((carrier) => (
            <div key={carrier.id} className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-semibold">{carrier.name}</p>
              <p className="text-sm">{carrier.delay_days} jours ouvrés</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}