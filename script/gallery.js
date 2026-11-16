(function () {
  const row = document.getElementById('gallery-row');
  if (!row) return;

  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('gallery') || '[]');
  } catch (e) {}

  if (list.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'col-12';
    empty.textContent = 'Aucune carte dans la galerie pour le moment.';
    row.appendChild(empty);
    return;
  }

  list.forEach((c) => {
    const col = document.createElement('div');
    col.className = 'col-4 col-lg-2';
    col.innerHTML = `
      <div class="card-select" data-id="${c.id}">
        <div class="card h-100 border-0">
          <img src="${c.img}" class="card-img-top" alt="">
          <div class="card-body p-2">
            <p class="card-text small mb-0">${c.name}</p>
          </div>
        </div>
      </div>`;
    row.appendChild(col);
  });
})();