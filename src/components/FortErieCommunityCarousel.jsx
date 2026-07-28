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
    url: "https://www.forterie.ca/living-in-fort-erie/garbage-and-recycling/",
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
    url: "https://www.forterie.ca/living-in-fort-erie/community-resources/sports-and-recreation/",
  },
  {
    title: "Volunteer Opportunities",
    description:
      "Connect with local organizations and discover ways to volunteer and contribute to the Fort Erie community.",
    image: "/images/volunteer-opportunities-banner.webp",
    url: "https://www.forterie.ca/living-in-fort-erie/community-resources/volunteer-opportunities/",
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

function CommunityCardGroup({ duplicate = false }) {
  return (
    <div
      className="fortErieCommunityGroup"
      aria-hidden={duplicate ? "true" : undefined}
    >
      {communityLinks.map((item) => (
        <CommunityCard
          key={`${duplicate ? "duplicate" : "original"}-${item.title}`}
          item={item}
          duplicate={duplicate}
        />
      ))}
    </div>
  );
}

export default function FortErieCommunityCarousel() {
  return (
    <section className="fortErieCommunitySection">
      <div className="fortErieCommunityContainer">
        <header className="fortErieCommunityHeader">
          <div className="fortErieCommunityHeading">
            <span className="fortErieCommunitySectionEyebrow">
              Connected to the Community
            </span>

            <h2>Explore Fort Erie</h2>

            <p>
              Quick access to local services, recreation, community programs,
              and important Town of Fort Erie resources.
            </p>
          </div>
        </header>
      </div>

      <div
        className="fortErieCommunityCarousel"
        aria-label="Fort Erie community resources"
      >
        <div className="fortErieCommunityTrack">
          <CommunityCardGroup />
          <CommunityCardGroup duplicate />
        </div>
      </div>

      <p className="fortErieCommunityMobileHint">
        Tap a card to visit the official resource.
      </p>
    </section>
  );
}