window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrollY = window.scrollY;
    const fadeEnd = window.innerHeight * 0.8;

    // Clamp values between 0 and 1
    const progress = Math.min(scrollY / fadeEnd, 1);

    // Fade out
    hero.style.opacity = 1 - progress;

    // Scale down slightly (from 1 to 0.94)
    const scale = 1 - progress * 0.06;
    hero.style.transform = `scale(${scale})`;
  });

  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

