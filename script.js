document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     01 — CAPABILITIES ACCORDION
  ========================================================= */

  const capabilityItems =
    document.querySelectorAll(".capability-item");

  capabilityItems.forEach((item) => {

    const trigger =
      item.querySelector(".capability-trigger");

    if (!trigger) return;

    trigger.addEventListener("click", () => {

      const wasOpen =
        item.classList.contains("is-open");

      capabilityItems.forEach((otherItem) => {

        otherItem.classList.remove("is-open");

        const otherTrigger =
          otherItem.querySelector(".capability-trigger");

        if (otherTrigger) {
          otherTrigger.setAttribute(
            "aria-expanded",
            "false"
          );
        }

      });

      if (!wasOpen) {

        item.classList.add("is-open");

        trigger.setAttribute(
          "aria-expanded",
          "true"
        );

      }

    });

  });


  /* =========================================================
     02 — PREPARE PROJECT CONTENT
     Wrap project-content children inside project-inner
     so CSS dropdown animation works properly.
  ========================================================= */

  const projects =
    document.querySelectorAll(".project");

  projects.forEach((project) => {

    const content =
      project.querySelector(".project-content");

    if (!content) return;

    if (!content.querySelector(":scope > .project-inner")) {

      const inner =
        document.createElement("div");

      inner.className = "project-inner";

      while (content.firstChild) {
        inner.appendChild(content.firstChild);
      }

      content.appendChild(inner);

    }

  });


  /* =========================================================
     03 — PROJECT OPEN / CLOSE
  ========================================================= */

  function closeProject(project) {

    if (!project) return;

    project.classList.remove("is-open");

    const trigger =
      project.querySelector(".project-trigger");

    if (trigger) {

      trigger.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  }


  function openProject(project) {

    if (!project) return;

    projects.forEach((otherProject) => {

      if (otherProject !== project) {
        closeProject(otherProject);
      }

    });

    project.classList.add("is-open");

    const trigger =
      project.querySelector(".project-trigger");

    if (trigger) {

      trigger.setAttribute(
        "aria-expanded",
        "true"
      );

    }

  }


  projects.forEach((project) => {

    const trigger =
      project.querySelector(".project-trigger");

    const closeButton =
      project.querySelector(".project-close");

    if (trigger) {

      trigger.addEventListener("click", () => {

        const wasOpen =
          project.classList.contains("is-open");

        if (wasOpen) {

          closeProject(project);

        } else {

          openProject(project);

          setTimeout(() => {

            project.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }, 250);

        }

      });

    }


    if (closeButton) {

      closeButton.addEventListener(
        "click",
        () => {

          closeProject(project);

          setTimeout(() => {

            project.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }, 100);

        }
      );

    }

  });


  /* =========================================================
     04 — LIGHTBOX
  ========================================================= */

  const galleryImages =
    Array.from(
      document.querySelectorAll(
        ".project-gallery img"
      )
    );


  if (galleryImages.length) {

    const lightbox =
      document.createElement("div");

    lightbox.className = "lightbox";

    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );


    lightbox.innerHTML = `

      <button
        class="lightbox-close"
        type="button"
        aria-label="Close image"
      >
        ×
      </button>

      <button
        class="lightbox-prev"
        type="button"
        aria-label="Previous image"
      >
        ←
      </button>

      <div class="lightbox-stage">

        <img
          class="lightbox-image"
          src=""
          alt=""
        >

        <div class="lightbox-counter">
        </div>

      </div>

      <button
        class="lightbox-next"
        type="button"
        aria-label="Next image"
      >
        →
      </button>

    `;


    document.body.appendChild(lightbox);


    const lightboxImage =
      lightbox.querySelector(
        ".lightbox-image"
      );

    const counter =
      lightbox.querySelector(
        ".lightbox-counter"
      );

    const closeButton =
      lightbox.querySelector(
        ".lightbox-close"
      );

    const prevButton =
      lightbox.querySelector(
        ".lightbox-prev"
      );

    const nextButton =
      lightbox.querySelector(
        ".lightbox-next"
      );


    let activeImages = [];
    let currentIndex = 0;


    function updateLightbox() {

      if (!activeImages.length) return;

      const image =
        activeImages[currentIndex];

      lightboxImage.style.opacity = "0";
      lightboxImage.style.transform =
        "scale(.985)";


      window.setTimeout(() => {

        lightboxImage.src =
          image.getAttribute("src");

        lightboxImage.alt =
          image.getAttribute("alt") ||
          "Portfolio image";

        counter.textContent =
          `${String(currentIndex + 1).padStart(2, "0")} / ${String(activeImages.length).padStart(2, "0")}`;

        lightboxImage.style.opacity = "1";
        lightboxImage.style.transform =
          "scale(1)";

      }, 120);

    }


    function openLightbox(clickedImage) {

      const gallery =
        clickedImage.closest(
          ".project-gallery"
        );

      if (gallery) {

        activeImages =
          Array.from(
            gallery.querySelectorAll("img")
          );

      } else {

        activeImages =
          galleryImages;

      }


      currentIndex =
        activeImages.indexOf(
          clickedImage
        );

      if (currentIndex < 0) {
        currentIndex = 0;
      }


      updateLightbox();

      lightbox.classList.add(
        "is-active"
      );

      lightbox.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.classList.add(
        "lightbox-open"
      );

    }


    function closeLightbox() {

      lightbox.classList.remove(
        "is-active"
      );

      lightbox.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.classList.remove(
        "lightbox-open"
      );

    }


    function nextImage() {

      if (!activeImages.length) return;

      currentIndex =
        (currentIndex + 1)
        % activeImages.length;

      updateLightbox();

    }


    function previousImage() {

      if (!activeImages.length) return;

      currentIndex =
        (
          currentIndex -
          1 +
          activeImages.length
        )
        % activeImages.length;

      updateLightbox();

    }


    galleryImages.forEach((image) => {

      image.addEventListener(
        "click",
        () => {

          openLightbox(image);

        }
      );

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

        if (
          !lightbox.classList.contains(
            "is-active"
          )
        ) {
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


  /* =========================================================
     05 — HEADER GLASS ON SCROLL
  ========================================================= */

  const header =
    document.querySelector(
      ".site-header"
    );


  function updateHeader() {

    if (!header) return;

    if (window.scrollY > 30) {

      header.classList.add(
        "is-scrolled"
      );

    } else {

      header.classList.remove(
        "is-scrolled"
      );

    }

  }


  updateHeader();


  window.addEventListener(
    "scroll",
    updateHeader,
    {
      passive: true
    }
  );


  /* =========================================================
     06 — SMOOTH INTERNAL NAVIGATION
  ========================================================= */

  const internalLinks =
    document.querySelectorAll(
      'a[href^="#"]'
    );


  internalLinks.forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const targetID =
          link.getAttribute("href");

        if (
          !targetID ||
          targetID === "#"
        ) {
          return;
        }


        const target =
          document.querySelector(
            targetID
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


  /* =========================================================
     07 — SUBTLE SCROLL REVEAL
  ========================================================= */

  const revealTargets =
    document.querySelectorAll(
      ".section-label, .section-heading, .about-grid"
    );


  if (
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(

        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "is-visible"
                );

                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },

        {
          threshold: .12
        }

      );


    revealTargets.forEach(
      (element) => {

        element.classList.add(
          "reveal-item"
        );

        observer.observe(
          element
        );

      }
    );

  } else {

    revealTargets.forEach(
      (element) => {

        element.classList.add(
          "is-visible"
        );

      }
    );

  }

  /* =========================================================
     08 — CONTACT REVEAL
  ========================================================= */

  const contactBtn = document.getElementById("reveal-contact-btn");
  const contactDetails = document.getElementById("contact-details-content");

  if (contactBtn && contactDetails) {
    contactBtn.addEventListener("click", () => {
      const isVisible = contactDetails.classList.contains("is-visible");
      
      if (isVisible) {
        contactDetails.classList.remove("is-visible");
        contactBtn.textContent = "View Contacts";
      } else {
        contactDetails.classList.add("is-visible");
        contactBtn.textContent = "Hide Contacts";
      }
    });
  }

});
