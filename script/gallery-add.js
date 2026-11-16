document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'gallery';
  const getGallery = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]').filter(c => c && c.id); }
    catch { return []; }
  };
  const saveGallery = (list) => localStorage.setItem(KEY, JSON.stringify(list));

  document.querySelectorAll('.card-select').forEach((cardSelect) => {
    const id = cardSelect.dataset.id;
    const body = cardSelect.querySelector('.card-body');
    if (!body) return;

    let btn = body.querySelector('.btn-add-gallery');
    if (!btn) {
      body.classList.add('d-flex', 'justify-content-between', 'align-items-center');
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-add-gallery';
      btn.setAttribute('aria-label', 'Ajouter à la galerie');
      body.appendChild(btn);
    }

    const refresh = () => {
      const inGallery = getGallery().some((c) => c.id === id);
      btn.classList.toggle('added', inGallery);
      btn.innerHTML = inGallery
        ? '<i class="bi bi-check-lg"></i>'
        : '<i class="bi bi-plus-lg"></i>';
    };

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const list = getGallery();
      const i = list.findIndex((c) => c.id === id);
      if (i === -1) {
        list.push({
          id,
          img: cardSelect.querySelector('img').getAttribute('src'),
          name: cardSelect.querySelector('.card-text').innerHTML
        });
      } else {
        list.splice(i, 1);
      }
      saveGallery(list);
      refresh();
    });

    refresh();
  });
});