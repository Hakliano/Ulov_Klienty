/**
 * Filtr článků na stránce /clanky — klientská strana, bez reloadu.
 * Tlačítka mění data-filter: all | poradce | remeslo | salon.
 * Skrývá/zobrazuje .article-card podle data-category.
 */
(function () {
  var filterBtns = document.querySelectorAll('.articles-filter__btn');
  var cards = document.querySelectorAll('.article-card');
  if (!filterBtns.length || !cards.length) return;

  function setActiveBtn(active) {
    filterBtns.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-filter') === active);
    });
  }

  function filterCards(value) {
    cards.forEach(function (card) {
      var cat = card.getAttribute('data-category') || '';
      var categories = cat.split(/\s+/).filter(Boolean);
      var show = value === 'all' || (categories.length && categories.indexOf(value) !== -1);
      card.style.display = show ? '' : 'none';
    });
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-filter') || 'all';
      setActiveBtn(value);
      filterCards(value);
    });
  });
})();
