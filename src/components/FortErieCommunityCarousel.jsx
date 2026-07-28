import { useEffect, useRef, useState } from "react";
import "./FortErieCommunityCarousel.css";

const communityLinks = [
  {
    title: "Town of Fort Erie",
    description:
      "Visit the official Town of Fort Erie website for municipal services, announcements, programs and community information.",
    image: "/images/forterie.svg",
    url: "https://www.forterie.ca/",
    imageType: "logo",
  },
  {
    title: "Bay Beach",
    description:
      "Find beach hours, admission information, parking details and seasonal updates for Bay Beach in Crystal Beach.",
    image: "/images/bay-beach-8804.webp",
    url: "https://www.forterie.ca/recreation-and-culture/bay-beach/",
  },
  {
    title: "Garbage and Recycling",
    description:
      "Access garbage collection information, recycling guidelines, schedules and waste-management resources.",
    image: "/images/garbage-and-recycling-banner.webp",
    url: "https://www.forterie.ca/living-in-fort-erie/garbage-and-recycling/#",
  },
  {
    title: "Council Meetings",
    description:
      "Learn how to speak before council and find information about Fort Erie municipal meetings and procedures.",
    image: "/images/img_3340.webp",
    url: "https://www.forterie.ca/town-hall/mayor-and-council/speaking-to-council/",
  },
  {
    title: "Parks and Trails",
    description:
      "Explore Fort Erie parks, walking trails, sports fields and outdoor spaces throughout the community.",
    image: "/images/nature-friendship-trail-cycling.webp",
    url: "https://www.forterie.ca/recreation-and-culture/parks-trails-and-sports-fields/",
  },
  {
    title: "Sports and Recreation",
    description:
      "Discover local recreation programs, sports organizations, clubs and activities for residents of all ages.",
    image: "/images/sports-and-recreation-banner.webp",
    url: "https://www.forterie.ca/living-in-fort-erie/community-resources/sports-and-recreation/#",
  },
  {
    title: "Volunteer Opportunities",
    description:
      "Connect with local organizations and discover ways to volunteer and contribute to the Fort Erie community.",
    image: "/images/volunteer-opportunities-banner.webp",
    url: "https://www.forterie.ca/living-in-fort-erie/community-resources/volunteer-opportunities/#",
  },
];

function CommunityCard({ item }) {
  return (
    <article className="fortErieCommunityCard">
      <a
        className="fortErieCommunityCardLink"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${item.title}`}
      >
        <div
          className={`fortErieCommunityImageWrapper ${
            item.imageType === "logo"
              ? "fortErieCommunityImageWrapperLogo"
              : ""
          }`}
        >
          <img
            className={`fortErieCommunityImage ${
              item.imageType === "logo" ? "fortErieCommunityLogo" : ""
            }`}
            src={item.image}
            alt={item.title}
            loading="lazy"
          />
        </div>

        <div className="fortErieCommunityCardContent">
          <span className="fortErieCommunityEyebrow">
            Fort Erie Community
          </span>

          <h3>{item.title}</h3>

          <p>{item.description}</p>

          <span className="fortErieCommunityCardButton">
            Visit Website
            <span aria-hidden="true">↗</span>
          </span>
        </div>
      </a>
    </article>
  );
}

export default function FortErieCommunityCarousel() {
  const carouselRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  function updateScrollButtons() {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const maximumScrollLeft =
      carousel.scrollWidth - carousel.clientWidth;

    setCanScrollLeft(carousel.scrollLeft > 5);
    setCanScrollRight(
      carousel.scrollLeft < maximumScrollLeft - 5
    );
  }

  function getScrollDistance() {
    const carousel = carouselRef.current;

    if (!carousel) {
      return 0;
    }

    const firstCard = carousel.querySelector(
      ".fortErieCommunityCard"
    );

    const cardWidth = firstCard?.offsetWidth || 340;
    const styles = window.getComputedStyle(carousel);
    const gap = Number.parseFloat(styles.columnGap) || 24;

    return cardWidth + gap;
  }

  function scrollCarousel(direction) {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const scrollDistance = getScrollDistance();

    carousel.scrollBy({
      left:
        direction === "left"
          ? -scrollDistance
          : scrollDistance,
      behavior: "smooth",
    });
  }

  function advanceCarousel() {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const maximumScrollLeft =
      carousel.scrollWidth - carousel.clientWidth;

    const reachedEnd =
      carousel.scrollLeft >= maximumScrollLeft - 10;

    if (reachedEnd) {
      carousel.scrollTo({
        left: 0,
        behavior: "smooth",
      });

      return;
    }

    carousel.scrollBy({
      left: getScrollDistance(),
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return undefined;
    }

    updateScrollButtons();

    carousel.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      carousel.removeEventListener(
        "scroll",
        updateScrollButtons
      );

      window.removeEventListener(
        "resize",
        updateScrollButtons
      );
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isPaused || prefersReducedMotion) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      advanceCarousel();
    }, 4500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPaused]);

  return (
    <section className="fortErieCommunitySection">
      <div className="fortErieCommunityContainer">
        <div className="fortErieCommunityHeader">
          <div className="fortErieCommunityHeading">
            <span className="fortErieCommunitySectionEyebrow">
              Connected to the Community
            </span>

            <h2>Explore Fort Erie</h2>

            <p>
              Quick access to local services, recreation,
              community programs and important Town of Fort
              Erie resources.
            </p>
          </div>

          <div
            className="fortErieCommunityControls"
            aria-label="Community carousel controls"
          >
            <button
              type="button"
              className="fortErieCommunityArrow"
              onClick={() => scrollCarousel("left")}
              disabled={!canScrollLeft}
              aria-label="View previous community resources"
            >
              <span aria-hidden="true">←</span>
            </button>

            <button
              type="button"
              className="fortErieCommunityArrow"
              onClick={() => scrollCarousel("right")}
              disabled={!canScrollRight}
              aria-label="View more community resources"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div
          className="fortErieCommunityCarousel"
          ref={carouselRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          aria-label="Fort Erie community resources"
        >
          {communityLinks.map((item) => (
            <CommunityCard
              key={item.title}
              item={item}
            />
          ))}
        </div>

        <p className="fortErieCommunityMobileHint">
          Swipe to explore more community resources.
        </p>
      </div>
    </section>
  );
}