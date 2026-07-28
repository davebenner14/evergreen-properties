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

function CommunityCard({ item, duplicate = false }) {
  return (
    <article
      className="fortErieCommunityCard"
      aria-hidden={duplicate ? "true" : undefined}
    >
      <a
        className="fortErieCommunityCardLink"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={duplicate ? -1 : 0}
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
            alt={duplicate ? "" : item.title}
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
  const animationFrameRef = useRef(null);
  const previousTimeRef = useRef(null);

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    /*
      Increase this number to make the carousel move faster.
      Recommended range: 20 to 45 pixels per second.
    */
    const pixelsPerSecond = 28;

    function animate(currentTime) {
      if (previousTimeRef.current === null) {
        previousTimeRef.current = currentTime;
      }

      const elapsedTime =
        (currentTime - previousTimeRef.current) / 1000;

      previousTimeRef.current = currentTime;

      if (!isPaused) {
        carousel.scrollLeft += pixelsPerSecond * elapsedTime;

        /*
          The cards are rendered twice.

          Once the carousel reaches the start of the duplicated
          cards, reset it back to the beginning. Because both
          halves are identical, the reset is visually seamless.
        */
        const halfwayPoint = carousel.scrollWidth / 2;

        if (carousel.scrollLeft >= halfwayPoint) {
          carousel.scrollLeft -= halfwayPoint;
        }
      }

      animationFrameRef.current =
        window.requestAnimationFrame(animate);
    }

    animationFrameRef.current =
      window.requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      previousTimeRef.current = null;
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
          {[...communityLinks, ...communityLinks].map(
            (item, index) => (
              <CommunityCard
                key={`${item.title}-${index}`}
                item={item}
                duplicate={index >= communityLinks.length}
              />
            )
          )}
        </div>

        <p className="fortErieCommunityMobileHint">
          Swipe to explore more community resources.
        </p>
      </div>
    </section>
  );
}