(function () {
  const slides = document.querySelectorAll('.actu-slide');
  const dots   = document.querySelectorAll('.actu-dot');
  const prev   = document.getElementById('actu-prev');
  const next   = document.getElementById('actu-next');
  let current  = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('opacity-100', 'relative');
    slides[current].classList.add('opacity-0', 'absolute');
    dots[current].classList.remove('bg-red-600', 'w-8');
    dots[current].classList.add('bg-white/30', 'w-3');

    current = (index + slides.length) % slides.length;
    slides[current].classList.remove('opacity-0', 'absolute');
    slides[current].classList.add('opacity-100', 'relative');
    dots[current].classList.remove('bg-white/30', 'w-3');
    dots[current].classList.add('bg-red-600', 'w-8');

    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  slides[0].classList.add('opacity-100', 'relative');
  slides[0].classList.remove('opacity-0', 'absolute');

  next.addEventListener('click', () => goTo(current + 1));
  prev.addEventListener('click', () => goTo(current - 1));
  dots.forEach(dot => dot.addEventListener('click', () => goTo(+dot.dataset.index)));
  resetTimer();
  const slider = document.getElementById('actu-slider');
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', resetTimer);
})();