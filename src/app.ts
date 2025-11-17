document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger") as HTMLElement | null;
  const navList = document.querySelector(".nav-list") as HTMLElement | null;
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
  const sections = document.querySelectorAll<HTMLElement>("section[id]");

  if (!hamburger || !navList) return;

  const toggleMenu = () => {
    hamburger.classList.toggle("active");
    navList.classList.toggle("open");
  };

  const closeMenu = () => {
    hamburger.classList.remove("active");
    navList.classList.remove("open");
  };

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      if (href && href.charAt(0) === "#") {
        closeMenu();
      }
    });
  });

  hamburger.addEventListener("click", toggleMenu);

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      let current = "home";
      const offset = window.scrollY + 160;

      sections.forEach(sec => {
        if (sec.offsetTop <= offset && (sec.offsetTop + sec.offsetHeight) > offset) {
          current = sec.id;
        }
      });

      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
      });

      ticking = false;
    });
  });
});

window.addEventListener("load", () => {
  const loader = document.getElementById("loader") as HTMLElement | null;

  if (!loader) return;

  setTimeout(() => {
    loader.classList.add("hidden");

    setTimeout(() => {
      loader.remove();
    }, 1000);
  }, 1000);
});