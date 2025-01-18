import './js/init'
import { images } from "./data/images";

import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';

import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loader = document.getElementById('loader');

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const query = e.target.elements.query.value.trim();
    if (!query) {
        iziToast.error({
            title: 'Error', message: 'Sorry, there are no images matching your search query. Please try again!'
        });
    }
}
);

gallery.innerHTML = '';
loader.classList.remove('hidden');

images(query)
    .then((data) => {
        if (data.hits.length === 0) {
            iziToast.error({
                title: 'Error', message: 'Sorry, there are no images matching your search query. Please try again!'
            });
        } else {
            const markup = data.hits
                .map((hit) => `
            <a href="${hit.largeImageURL}" class="gallery__item">
            <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
            <div class="info">
            <p>❤️ Likes: ${hit.likes}</p>
            <p>👁 Views: ${hit.views}</p>
            <p>💬 Comments: ${hit.comments}</p>
            <p>⬇ Downloads: ${hit.downloads}</p>
          </div>
        </a>
      `
                ).join('');
      gallery.insertAdjacentHTML('beforeend', markup);

      lightbox.refresh();
    }
        })
    .catch((error) => {
        iziToast.error({
            title: 'Error', message: 'Sorry, there are no images matching your search query. Please try again!' 
        })
            .finally(() => {
            loader.classList.add('hidden');
        })
    });

