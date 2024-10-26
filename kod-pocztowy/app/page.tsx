"use client";
import { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';

// Funkcja do pobierania kodu pocztowego
const fetchPostalCode = async (city, street, buildingNumber) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?city=${city}&street=${street} ${buildingNumber}&format=json&addressdetails=1`
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data[0] || null;
};

export default function Home() {
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [location, setLocation] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedDarkMode = localStorage.getItem('darkMode');
    const isDarkMode = savedDarkMode === null ? userPrefersDark : JSON.parse(savedDarkMode);
    setDarkMode(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);

    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    if (!city || !street || !buildingNumber) {
      setError('Wszystkie pola są wymagane.');
      setLoading(false);
      return;
    }

    try {
      const result = await fetchPostalCode(city, street, buildingNumber);
      if (result) {
        setPostalCode(result.address.postcode || 'Nie znaleziono kodu pocztowego');
        setLocation(result.address.city || result.address.town || result.address.village || 'Nie znaleziono miejscowości');

        const newHistory = [...searchHistory, { city, street, buildingNumber, result }];
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      } else {
        setPostalCode('Nie znaleziono kodu pocztowego');
        setLocation('Nie znaleziono miejscowości');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas wyszukiwania kodu pocztowego.');
    }
    setLoading(false);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md w-full">
        <header className="mb-4 text-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">Wyszukaj Kod Pocztowy</h1>
        </header>

        {/* Przełącznik trybu jasnego/ciemnego */}
        <div className="flex justify-end mb-4">
          <label className="flex cursor-pointer gap-2 items-center">
            {/* Ikona Słońca */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={darkMode ? "white" : "black"} // Kolor zmienia się w zależności od trybu
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="toggle theme-controller border-sky-400 bg-amber-300 checked:border-blue-800 checked:bg-blue-300"
            />
            {/* Ikona Księżyca */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={darkMode ? "white" : "black"} // Kolor zmienia się w zależności od trybu
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </label>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">Miasto:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Miasto"
            className="input input-bordered w-full max-w-xs"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">Ulica:</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Ulica"
            className="input input-bordered w-full max-w-xs"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">Numer Budynku:</label>
          <input
            type="text"
            value={buildingNumber}
            onChange={(e) => setBuildingNumber(e.target.value)}
            placeholder="Numer Budynku"
            className="input input-bordered w-full max-w-xs"
          />
        </div>

        <button onClick={handleSearch} className={`mt-4 px-4 py-2 rounded-lg font-bold transition duration-200 
          ${darkMode ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
          {loading ? 'Ładowanie...' : 'Znajdź Kod Pocztowy'}
        </button>

        <div className="mt-6 text-center text-gray-800 dark:text-gray-200">
          {postalCode && <strong>Kod Pocztowy:</strong>} {postalCode} <br />
          {location && <strong>Miejscowość:</strong>} {location}
        </div>

        {/* Wyświetlanie historii wyszukiwania */}
        {searchHistory.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Historia Wyszukiwania:</h2>
            <ul className="mt-2 text-gray-600 dark:text-gray-400">
              {searchHistory.map((item, index) => (
                <li key={index}>
                  {item.city}, {item.street} {item.buildingNumber}
                </li>
              ))}
            </ul>
            <button onClick={clearSearchHistory} className="btn btn-error mt-4 flex items-center">
              Wyczyść Historię
            </button>
          </div>
        )}

        <footer className="mt-6 text-center text-gray-600 dark:text-gray-400">
          &copy; 2024 Moja Aplikacja
        </footer>
      </div>
    </div>
  );
}
