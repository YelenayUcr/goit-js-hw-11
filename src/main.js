import { fetchImages } from './js/images.js';
import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.getElementById('load-more');
const loader = document.getElementById('loader');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let query = '';
let page = 1;

form.addEventListener('submit', function (e) {
  e.preventDefault();
  query = e.target.elements.query.value.trim();
  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query!',
    });
    return;
  }

  gallery.innerHTML = '';
  page = 1;
  loadImages(query, page);
});

loadMoreBtn.addEventListener('click', function () {
  page += 1;
  loadImages(query, page);
});

function loadImages(query, page) {
  loader.classList.remove('hidden');
  fetchImages(query, page)
    .then((data) => {
      if (data.hits.length === 0) {
        iziToast.warning({
          title: 'No Results',
          message: 'Sorry, there are no images matching your search query. Please, try again!',
        });
        loadMoreBtn.classList.add('hidden');
      } else {
        displayImages(data.hits);
        loadMoreBtn.classList.remove('hidden');
        if (data.hits.length < 20) {
          loadMoreBtn.classList.add('hidden');
        }
      }
    })
    .catch((error) => {
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong. Please try again later.',
      });
    })
    .finally(() => {
      loader.classList.add('hidden');
    });
}

function displayImages(images) {
  const markup = images
    .map(
      (image) => `
    <a href="${image.largeImageURL}" class="gallery__item">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p>❤️ Likes: ${image.likes}</p>
        <p>👁 Views: ${image.views}</p>
        <p>💬 Comments: ${image.comments}</p>
        <p>⬇ Downloads: ${image.downloads}</p>
      </div>
    </a>
  `
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}