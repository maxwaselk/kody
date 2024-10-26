// app/page.tsx
"use client";  // Add this directive at the top

import { useState } from 'react';
import 'tailwindcss/tailwind.css';

const fetchPostalCode = async (city, street, buildingNumber) => {
  const response = await fetch(`https://api.zippopotam.us/PL/${city}/${street}/${buildingNumber}`);
  const data = await response.json();
  return data.post_code || 'Nie znaleziono kodu pocztowego';
};

export default function Home() {
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleSearch = async () => {
    const code = await fetchPostalCode(city, street, buildingNumber);
    setPostalCode(code);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Wyszukiwarka Kodów Pocztowych</h1>
      <div className="mb-2">
        <label>Miasto:</label>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="border p-2 w-full" />
      </div>
      <div className="mb-2">
        <label>Ulica:</label>
        <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="border p-2 w-full" />
      </div>
      <div className="mb-2">
        <label>Numer Budynku:</label>
        <input type="text" value={buildingNumber} onChange={(e) => setBuildingNumber(e.target.value)} className="border p-2 w-full" />
      </div>
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2">
  Znajdź Kod Pocztowy
</button>
      <div className="mt-4">
        <strong>Kod Pocztowy:</strong> {postalCode}
      </div>
    </div>
  );
}
