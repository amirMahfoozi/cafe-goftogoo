interface HorizontalRect {
  left: number;
  right: number;
  width: number;
}

export const getHorizontalRevealDelta = (
  railRect: HorizontalRect,
  linkRect: HorizontalRect,
  edgePadding = 12,
): number | null => {
  const isClipped =
    linkRect.left < railRect.left + edgePadding ||
    linkRect.right > railRect.right - edgePadding;

  if (!isClipped) return null;

  const linkCenter = linkRect.left + linkRect.width / 2;
  const railCenter = railRect.left + railRect.width / 2;
  return linkCenter - railCenter;
};

export const getSectionScrollTop = (
  currentScrollY: number,
  targetViewportTop: number,
  navViewportTop: number,
  navHeight: number,
): number => {
  const stickyOffset = navHeight + Math.max(navViewportTop, 0) + 12;
  return Math.max(0, currentScrollY + targetViewportTop - stickyOffset);
};

if (typeof document !== "undefined") {
  const nav = document.querySelector<HTMLElement>("[data-category-nav]");
  const scroller = document.querySelector<HTMLElement>(
    "[data-category-scroller]",
  );
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("[data-category-link]"),
  );
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>("[data-menu-section]"),
  );

  if (!nav || !scroller || links.length === 0 || sections.length === 0) {
    // The static anchors remain fully usable if the enhanced navigation
    // cannot initialize.
  } else {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeCategory = "";

    const motionBehavior = (): ScrollBehavior =>
      reduceMotion.matches ? "auto" : "smooth";

    // Move only the horizontal category rail. scrollIntoView() is intentionally
    // avoided here because it can also move the document vertically.
    const revealCategoryLink = (link: HTMLAnchorElement): void => {
      const railRect = scroller.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      const delta = getHorizontalRevealDelta(railRect, linkRect);
      if (delta === null) return;

      scroller.scrollBy({
        left: delta,
        behavior: motionBehavior(),
      });
    };

    const setActiveCategory = (categoryId: string): void => {
      if (activeCategory === categoryId) return;
      activeCategory = categoryId;

      for (const link of links) {
        const isActive = link.dataset.categoryLink === categoryId;
        if (isActive) {
          link.setAttribute("aria-current", "true");
          revealCategoryLink(link);
        } else {
          link.removeAttribute("aria-current");
        }
      }
    };

    const scrollToSection = (categoryId: string): void => {
      const target = document.getElementById(`category-${categoryId}`);
      if (!target) return;

      const navRect = nav.getBoundingClientRect();
      const targetTop = getSectionScrollTop(
        window.scrollY,
        target.getBoundingClientRect().top,
        navRect.top,
        navRect.height,
      );

      window.scrollTo({
        top: targetTop,
        behavior: motionBehavior(),
      });
      window.history.replaceState(null, "", `#category-${categoryId}`);
    };

    for (const link of links) {
      link.addEventListener("click", (event) => {
        const categoryId = link.dataset.categoryLink;
        if (!categoryId) return;

        event.preventDefault();
        setActiveCategory(categoryId);
        scrollToSection(categoryId);
      });
    }

    const visibleSections = new Map<string, number>();
    const navHeight = Math.ceil(nav.getBoundingClientRect().height + 12);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const categoryId = (entry.target as HTMLElement).dataset.menuSection;
          if (!categoryId) continue;

          if (entry.isIntersecting) {
            visibleSections.set(categoryId, entry.boundingClientRect.top);
          } else {
            visibleSections.delete(categoryId);
          }
        }

        const nearestSection = [...visibleSections.entries()].sort(
          ([, topA], [, topB]) =>
            Math.abs(topA - navHeight) - Math.abs(topB - navHeight),
        )[0];

        if (nearestSection) setActiveCategory(nearestSection[0]);
      },
      {
        rootMargin: `-${navHeight}px 0px -55% 0px`,
        threshold: [0, 0.08, 0.25, 0.5],
      },
    );

    for (const section of sections) observer.observe(section);

    const initialCategory = window.location.hash.startsWith("#category-")
      ? window.location.hash.replace("#category-", "")
      : links[0]?.dataset.categoryLink;

    if (initialCategory) setActiveCategory(initialCategory);
  }
}
