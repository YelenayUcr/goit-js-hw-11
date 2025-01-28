const API_KEY = '48307401-677547b5d41e0bab8fbb923eb';
const BASE_URL = 'https://pixabay.com/api/';

export function fetchImages(query, page = 1) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}`;

  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    return response.json();
  });
}