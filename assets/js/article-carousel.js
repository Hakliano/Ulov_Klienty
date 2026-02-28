/**
 * Carousel dalších článků.
 * - Pokud má .article-carousel atribut data-src (URL na JSON), načte seznam článků a vykreslí karty.
 * - data-base = předpona pro odkazy (např. "clanky/" na indexu, "" na stránce článku).
 * - Tlačítka předchozí/další a volitelně data-auto-advance.
 */
(function () {
  var cardWidth = 320 + 24;

  function renderCard(article, baseUrl, opts) {
    opts = opts || {};
    var href = (baseUrl || '') + article.slug;
    var subtitle = article.subtitle
      ? '<p class="article-carousel__card-subtitle">' + escapeHtml(article.subtitle) + '</p>'
      : '';
    var excerpt = article.excerpt || '';
    if (opts.excerptMax) {
      var max = parseInt(opts.excerptMax, 10) || 0;
      if (max > 0 && excerpt.length > max) excerpt = excerpt.slice(0, max).trim() + '…';
    }
    var btnText = opts.btnText || 'Číst celý článek';
    return (
      '<a href="' +
      escapeHtml(href) +
      '" class="article-carousel__card">' +
      '<img src="' +
      escapeHtml(article.image) +
      '" alt="' +
      escapeHtml(article.alt) +
      '" width="320" height="180" loading="lazy">' +
      '<h3 class="article-carousel__card-title">' +
      escapeHtml(article.title) +
      '</h3>' +
      subtitle +
      '<p class="article-carousel__card-excerpt">' +
      escapeHtml(excerpt) +
      '</p>' +
      '<span class="btn btn--small">' + escapeHtml(btnText) + '</span>' +
      '</a>'
    );
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function initScroll(carousel) {
    var track = carousel.querySelector('.article-carousel__track');
    var prevBtn = carousel.querySelector('.article-carousel__prev');
    var nextBtn = carousel.querySelector('.article-carousel__next');
    if (!track || !prevBtn || !nextBtn) return;

    var autoAdvanceMs = carousel.getAttribute('data-auto-advance');
    var scrollAmount = autoAdvanceMs ? cardWidth : cardWidth * 1.5;

    function scroll(direction) {
      var step = direction === 'next' ? scrollAmount : -scrollAmount;
      track.scrollBy({ left: step, behavior: 'smooth' });
    }

    prevBtn.addEventListener('click', function () {
      scroll('prev');
    });
    nextBtn.addEventListener('click', function () {
      scroll('next');
    });

    if (autoAdvanceMs) {
      var ms = parseInt(autoAdvanceMs, 10) || 3000;
      setInterval(function () {
        var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
        if (atEnd) {
          track.scrollLeft = 0;
        } else {
          track.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }, ms);
    }
  }

  function runCarousel(carousel) {
    var dataSrc = carousel.getAttribute('data-src');
    var baseUrl = carousel.getAttribute('data-base') || '';
    var limit = carousel.getAttribute('data-limit');
    var track = carousel.querySelector('.article-carousel__track');
    var opts = {
      btnText: carousel.getAttribute('data-btn-text') || 'Číst celý článek',
      excerptMax: carousel.getAttribute('data-excerpt-max') || ''
    };

    if (dataSrc && track) {
      fetch(dataSrc)
        .then(function (r) {
          if (!r.ok) throw new Error('JSON ' + r.status);
          return r.json();
        })
        .then(function (articles) {
          if (!Array.isArray(articles)) throw new Error('Neplatná data');
          if (limit) {
            var n = parseInt(limit, 10) || 0;
            if (n > 0) articles = articles.slice(0, n);
          }
          track.innerHTML = articles.map(function (a) { return renderCard(a, baseUrl, opts); }).join('');
          initScroll(carousel);
        })
        .catch(function (err) {
          if (err && err.message) console.warn('Article carousel:', err.message);
          initScroll(carousel);
        });
    } else {
      initScroll(carousel);
    }
  }

  var carousels = document.querySelectorAll('.article-carousel');
  carousels.forEach(runCarousel);
})();
