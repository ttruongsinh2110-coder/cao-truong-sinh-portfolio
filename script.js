document.addEventListener("DOMContentLoaded", () => {

  /* ========================================
     01. CASE STUDY INTERACTIONS
  ======================================== */

  const caseSections = document.querySelectorAll(".case-section");

  caseSections.forEach((section) => {

    const copy = section.querySelector(".case-copy");
    if (!copy) return;

    section.classList.add("case-interactive");

    copy.setAttribute("role", "button");
    copy.setAttribute("tabindex", "0");

    const toggleCase = () => {

      const isActive = section.classList.contains("is-open");

      // Close other sections
      caseSections.forEach((item) => {
        if (item !== section) {
          item.classList.remove("is-open");
        }
      });

      section.classList.toggle("is-open", !isActive);

      if (!isActive) {
        setTimeout(() => {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 200);
      }

    };

    copy.addEventListener("click", toggleCase);

    copy.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCase();
      }
    });

  });


  /* ========================================
     02. IMAGE LIGHTBOX
  ======================================== */

  const portfolioImages = document.querySelectorAll(
    ".case-section img, .project-gallery img, .gallery img"
  );

  if (portfolioImages.length > 0) {

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";

    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close image">
        ×
      </button>

      <button class="lightbox-prev" aria-label="Previous image">
        ←
      </button>

      <div class="lightbox-stage">
        <img class="lightbox-image" src="" alt="">
        <div class="lightbox-counter"></div>
      </div>

      <button class="lightbox-next" aria-label="Next image">
        →
      </button>
    `;

    document.body.appendChild(lightbox);

    const lightboxImage =
      lightbox.querySelector(".lightbox-image");

    const counter =
      lightbox.querySelector(".lightbox-counter");

    const closeButton =
      lightbox.querySelector(".lightbox-close");

    const prevButton =
      lightbox.querySelector(".lightbox-prev");

    const nextButton =
      lightbox.querySelector(".lightbox-next");

    let activeImages = [];
    let currentIndex = 0;


    function updateLightbox() {

      if (!activeImages.length) return;

      const image = activeImages[currentIndex];

      lightboxImage.style.opacity = "0";

      setTimeout(() => {

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt || "Portfolio work";

        counter.textContent =
          `${String(currentIndex + 1).padStart(2, "0")} / ${String(activeImages.length).padStart(2, "0")}`;

        lightboxImage.style.opacity = "1";

      }, 120);

    }


    function openLightbox(image) {

      const section =
        image.closest(".case-section") ||
        image.closest(".project-gallery") ||
        image.closest(".gallery");

      if (section) {

        activeImages =
          Array.from(section.querySelectorAll("img"));

      } else {

        activeImages =
          Array.from(portfolioImages);

      }

      currentIndex =
        activeImages.indexOf(image);

      if (currentIndex < 0) {
        currentIndex = 0;
      }

      updateLightbox();

      lightbox.classList.add("is-active");

      document.body.classList.add("lightbox-open");

    }


    function closeLightbox() {

      lightbox.classList.remove("is-active");

      document.body.classList.remove("lightbox-open");

    }


    function nextImage() {

      currentIndex =
        (currentIndex + 1) % activeImages.length;

      updateLightbox();

    }


    function previousImage() {

      currentIndex =
        (currentIndex - 1 + activeImages.length)
        % activeImages.length;

      updateLightbox();

    }


    portfolioImages.forEach((image) => {

      image.classList.add("portfolio-image");

      image.addEventListener("click", () => {
        openLightbox(image);
      });

    });


    closeButton.addEventListener(
      "click",
      closeLightbox
    );

    nextButton.addEventListener(
      "click",
      nextImage
    );

    prevButton.addEventListener(
      "click",
      previousImage
    );


    lightbox.addEventListener(
      "click",
      (event) => {

        if (event.target === lightbox) {
          closeLightbox();
        }

      }
    );


    document.addEventListener(
      "keydown",
      (event) => {

        if (!lightbox.classList.contains("is-active")) {
          return;
        }

        if (event.key === "Escape") {
          closeLightbox();
        }

        if (event.key === "ArrowRight") {
          nextImage();
        }

        if (event.key === "ArrowLeft") {
          previousImage();
        }

      }
    );

  }


  /* ========================================
     03. SCROLL REVEAL
  ======================================== */

  const revealItems =
    document.querySelectorAll(
      ".case-section, .capability-row, .project-meta"
    );

  const observer =
    new IntersectionObserver(

      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },

      {
        threshold: 0.12
      }

    );


  revealItems.forEach((item) => {

    item.classList.add("reveal-item");

    observer.observe(item);

  });


  /* ========================================
     04. NAVIGATION
  ======================================== */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          const targetId =
            link.getAttribute("href");

          if (
            !targetId ||
            targetId === "#"
          ) {
            return;
          }

          const target =
            document.querySelector(
              targetId
            );

          if (!target) return;

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    });


  /* ========================================
     05. HEADER ON SCROLL
  ======================================== */

  const header =
    document.querySelector(".site-header");

  if (header) {

    window.addEventListener(
      "scroll",
      () => {

        if (window.scrollY > 40) {

          header.classList.add(
            "is-scrolled"
          );

        } else {

          header.classList.remove(
            "is-scrolled"
          );

        }

      }
    );

  }

});
