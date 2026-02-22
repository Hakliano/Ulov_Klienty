/**
 * Carousel dalších článků.
 * Tlačítka předchozí/další posunou pruh doleva/doprava.
 * Na index.html: data-auto-advance="3000" = posun o jednu kartu každé 3 s.
 */
(function () {
  var carousel = document.querySelector('.article-carousel');
  if (!carousel) return;

  var track = carousel.querySelector('.article-carousel__track');
  var prevBtn = carousel.querySelector('.article-carousel__prev');
  var nextBtn = carousel.querySelector('.article-carousel__next');
  if (!track || !prevBtn || !nextBtn) return;

  var cardWidth = 320 + 24; // 320px card + 24px gap
  var autoAdvanceMs = carousel.getAttribute('data-auto-advance');
  var scrollAmount = autoAdvanceMs ? cardWidth : cardWidth * 1.5;

  function scroll(direction) {
    var step = direction === 'next' ? scrollAmount : -scrollAmount;
    track.scrollBy({ left: step, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', function () { scroll('prev'); });
  nextBtn.addEventListener('click', function () { scroll('next'); });

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
})();
