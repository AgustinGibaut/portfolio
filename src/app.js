document.addEventListener("DOMContentLoaded", function () {
    var hamburger = document.querySelector(".hamburger");
    var navList = document.querySelector(".nav-list");
    var navLinks = document.querySelectorAll(".nav-link");
    var sections = document.querySelectorAll("section[id]");
    if (!hamburger || !navList)
        return;
    var toggleMenu = function () {
        hamburger.classList.toggle("active");
        navList.classList.toggle("open");
    };
    var closeMenu = function () {
        hamburger.classList.remove("active");
        navList.classList.remove("open");
    };
    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            var href = link.getAttribute("href");
            if (href && href.charAt(0) === "#") {
                closeMenu();
            }
        });
    });
    hamburger.addEventListener("click", toggleMenu);
    var ticking = false;
    window.addEventListener("scroll", function () {
        if (ticking)
            return;
        ticking = true;
        requestAnimationFrame(function () {
            var current = "home";
            var offset = window.scrollY + 160;
            sections.forEach(function (sec) {
                if (sec.offsetTop <= offset && (sec.offsetTop + sec.offsetHeight) > offset) {
                    current = sec.id;
                }
            });
            navLinks.forEach(function (link) {
                link.classList.toggle("active", link.getAttribute("href") === "#".concat(current));
            });
            ticking = false;
        });
    });
});
window.addEventListener("load", function () {
    var loader = document.getElementById("loader");
    if (!loader)
        return;
    setTimeout(function () {
        loader.classList.add("hidden");
        setTimeout(function () {
            loader.remove();
        }, 1000);
    }, 1000);
});
