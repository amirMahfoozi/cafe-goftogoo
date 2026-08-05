const fallbackImage = `${import.meta.env.BASE_URL}images/menu/fallback.svg`;

for (const image of document.querySelectorAll<HTMLImageElement>(
  "[data-menu-image]",
)) {
  image.addEventListener(
    "error",
    () => {
      if (image.dataset.fallbackApplied === "true") return;
      image.dataset.fallbackApplied = "true";
      image.src = fallbackImage;
      image.removeAttribute("srcset");
    },
    { once: true },
  );
}
