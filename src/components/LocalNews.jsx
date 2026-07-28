import { useEffect, useState } from "react";
import "./LocalNews.css";

/*
  Words associated with community activities, positive local
  developments, family events and feel-good stories.
*/
const POSITIVE_KEYWORDS = [
  "event",
  "events",
  "festival",
  "festivals",
  "parade",
  "parades",
  "market",
  "markets",
  "concert",
  "concerts",
  "celebration",
  "celebrates",
  "celebrating",
  "community",
  "family",
  "families",
  "fundraiser",
  "fundraising",
  "volunteer",
  "volunteers",
  "award",
  "awards",
  "awarded",
  "opening",
  "opens",
  "opened",
  "launch",
  "launched",
  "tourism",
  "arts",
  "culture",
  "cultural",
  "sports",
  "recreation",
  "fair",
  "fairs",
  "busker",
  "buskers",
  "fireworks",
  "holiday",
  "food",
  "donation",
  "donates",
  "donated",
  "scholarship",
  "success",
  "successful",
  "anniversary",
  "milestone",
  "attraction",
  "attractions",
  "performance",
  "performances",
  "exhibition",
  "exhibitions",
  "workshop",
  "workshops",
  "children",
  "summer",
  "weekend",
  "celebrate",
  "entertainment",
  "music",
  "garden",
  "park",
  "parks",
  "trail",
  "trails",
  "restaurant",
  "restaurants",
  "local business",
  "small business",
  "grand opening",
  "charity",
  "heritage",
];

/*
  These words lower an article's score.

  They do not automatically remove every article because an
  otherwise useful story may still contain one of these words.
*/
const NEGATIVE_KEYWORDS = [
  "murder",
  "murdered",
  "homicide",
  "killed",
  "death",
  "dead",
  "shooting",
  "shot",
  "stabbing",
  "stabbed",
  "assault",
  "charged",
  "arrested",
  "crime",
  "criminal",
  "collision",
  "crash",
  "fatal",
  "fraud",
  "scam",
  "outbreak",
  "victim",
  "police investigation",
  "wanted by police",
  "missing person",
  "drug trafficking",
  "weapon",
  "weapons",
  "robbery",
  "robbed",
  "fire destroys",
  "house fire",
];

/*
  These are especially severe topics.

  Articles containing these phrases are normally excluded unless
  there are not enough other local stories to display.
*/
const BLOCKED_KEYWORDS = [
  "murder",
  "homicide",
  "shooting",
  "stabbing",
  "fatal collision",
  "fatal crash",
  "sexual assault",
  "child abuse",
  "human trafficking",
  "missing person",
];

/*
  Combines all useful article text into one searchable string.
*/
function getArticleText(article) {
  const keywords = Array.isArray(article.keywords)
    ? article.keywords.join(" ")
    : article.keywords;

  const categories = Array.isArray(article.categories)
    ? article.categories.join(" ")
    : article.categories;

  return [
    article.title,
    article.description,
    article.snippet,
    keywords,
    categories,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/*
  Gives positive community stories a higher score and gives
  negative or disturbing stories a lower score.
*/
function getArticleScore(article) {
  const articleText = getArticleText(article);
  let score = 0;

  POSITIVE_KEYWORDS.forEach((keyword) => {
    if (articleText.includes(keyword)) {
      score += 3;
    }
  });

  NEGATIVE_KEYWORDS.forEach((keyword) => {
    if (articleText.includes(keyword)) {
      score -= 5;
    }
  });

  /*
    Give newer articles a small bonus.

    This helps prevent a somewhat-positive older story from
    beating a very recent community story.
  */
  const publishedDate = new Date(article.published_at);
  const ageInDays =
    (Date.now() - publishedDate.getTime()) /
    (1000 * 60 * 60 * 24);

  if (ageInDays <= 7) {
    score += 4;
  } else if (ageInDays <= 30) {
    score += 2;
  } else if (ageInDays <= 60) {
    score += 1;
  }

  return score;
}

/*
  Returns true when an article contains a particularly disturbing
  topic that does not fit the positive community tone of the site.
*/
function containsBlockedTopic(article) {
  const articleText = getArticleText(article);

  return BLOCKED_KEYWORDS.some((keyword) =>
    articleText.includes(keyword)
  );
}

/*
  Handles each article image independently.

  If an image is missing, broken, blocked by the publisher,
  or too small to display cleanly, the Evergreen Properties
  fallback image is shown instead.
*/
function NewsImage({ article }) {
  const [imageFailed, setImageFailed] = useState(!article.image_url);

  function handleImageLoad(event) {
    const image = event.currentTarget;

    /*
      Very small source images become blurry when stretched
      across the full width of a news card.
    */
    const imageIsTooSmall =
      image.naturalWidth < 500 || image.naturalHeight < 250;

    if (imageIsTooSmall) {
      setImageFailed(true);
    }
  }

  function handleImageError() {
    setImageFailed(true);
  }

  if (imageFailed) {
    return (
      <div className="newsImageFallback">
        <img
          src="/logos/EPIcon.png"
          alt=""
          aria-hidden="true"
        />

        <span>Around Niagara</span>
      </div>
    );
  }

  return (
    <img
      src={article.image_url}
      alt={article.title || "Around Niagara story"}
      className="newsCardImage"
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={handleImageLoad}
      onError={handleImageError}
    />
  );
}

function LocalNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchLocalNews() {
      try {
        const API_TOKEN =
          "0oLO56rvYVm8ITpWOOwIP4VtRctpIuIdyCUv9vgz";

        /*
          These searches intentionally focus on events, activities,
          community stories and positive local developments.

          The final two searches provide a small pool of broader
          local news so important stories are not completely hidden.
        */
        const searches = [
          {
            label: "Fort Erie events",
            query:
              "Fort Erie Ontario events festival market parade community",
            type: "positive",
          },
          {
            label: "Niagara Falls events",
            query:
              "Niagara Falls Ontario events festival concert community",
            type: "positive",
          },
          {
            label: "Niagara Region events",
            query:
              "Niagara Region Ontario events family festival market",
            type: "positive",
          },
          {
            label: "Niagara community",
            query:
              "Niagara Ontario community fundraiser volunteer award opening",
            type: "positive",
          },
          {
            label: "Fort Erie general news",
            query: "Fort Erie Ontario",
            type: "general",
          },
          {
            label: "Niagara general news",
            query: "Niagara Falls Niagara Region Ontario",
            type: "general",
          },
        ];

        /*
          Search within the last 90 days.

          Local event coverage can be less frequent than general news,
          so 90 days provides a better pool without pulling in stories
          that are several years old.
        */
        const cutoffDate = new Date();

        cutoffDate.setDate(cutoffDate.getDate() - 90);
        cutoffDate.setHours(0, 0, 0, 0);

        const publishedAfter = cutoffDate
          .toISOString()
          .split("T")[0];

        /*
          Create one request for each community or general-news search.
        */
        const requests = searches.map((search) => {
          const url =
            `https://api.thenewsapi.com/v1/news/all` +
            `?api_token=${API_TOKEN}` +
            `&search=${encodeURIComponent(search.query)}` +
            `&search_fields=title,description,keywords` +
            `&language=en` +
            `&locale=ca` +
            `&published_after=${publishedAfter}` +
            `&sort=published_at` +
            `&limit=3`;

          return fetch(url).then(async (response) => {
            if (!response.ok) {
              const errorBody = await response.text();

              throw new Error(
                `News API request failed with status ` +
                  `${response.status}: ${errorBody}`
              );
            }

            const result = await response.json();

            /*
              Mark each article with the kind of search that found it.

              This helps us prioritize the intentional community searches.
            */
            return {
              ...result,
              searchLabel: search.label,
              searchType: search.type,
              data: (result.data || []).map((article) => ({
                ...article,
                searchType: search.type,
                searchLabel: search.label,
              })),
            };
          });
        });

        /*
          Run all six requests simultaneously.
        */
        const results = await Promise.all(requests);

        /*
          Combine the result sets and reject invalid or old dates.
        */
        const combinedArticles = results
          .flatMap((result) => result.data || [])
          .filter((article) => {
            if (!article.url || !article.title || !article.published_at) {
              return false;
            }

            const publishedDate = new Date(article.published_at);

            if (Number.isNaN(publishedDate.getTime())) {
              return false;
            }

            return publishedDate >= cutoffDate;
          });

        /*
          Remove duplicate stories.

          When the same article appears in multiple searches, prefer
          the positive/community version of the article metadata.
        */
        const articleMap = new Map();

        combinedArticles.forEach((article) => {
          const articleKey =
            article.uuid ||
            article.url ||
            `${article.title}-${article.published_at}`;

          const existingArticle = articleMap.get(articleKey);

          if (
            !existingArticle ||
            article.searchType === "positive"
          ) {
            articleMap.set(articleKey, article);
          }
        });

        const uniqueArticles = Array.from(articleMap.values());

        /*
          Add an internal score to each story so we can inspect the
          results while testing.
        */
        const scoredArticles = uniqueArticles.map((article) => ({
          ...article,
          communityScore: getArticleScore(article),
          blockedTopic: containsBlockedTopic(article),
        }));

        /*
          Positive stories must have a score above zero and cannot
          contain one of the especially disturbing blocked topics.
        */
        const positiveArticles = scoredArticles
          .filter(
            (article) =>
              article.communityScore > 0 &&
              !article.blockedTopic
          )
          .sort((articleA, articleB) => {
            const scoreDifference =
              articleB.communityScore -
              articleA.communityScore;

            if (scoreDifference !== 0) {
              return scoreDifference;
            }

            return (
              new Date(articleB.published_at).getTime() -
              new Date(articleA.published_at).getTime()
            );
          });

        /*
          The general-news group includes useful neutral stories, but
          rejects the most disturbing subjects.

          Lower-scoring articles are allowed here so that major local
          updates can still appear in moderation.
        */
        const generalArticles = scoredArticles
          .filter(
            (article) =>
              article.communityScore <= 0 &&
              !article.blockedTopic &&
              article.communityScore >= -5
          )
          .sort(
            (articleA, articleB) =>
              new Date(articleB.published_at).getTime() -
              new Date(articleA.published_at).getTime()
          );

        /*
          Aim for:
          - Six positive/community stories
          - Three neutral or important general stories
        */
        const selectedPositiveArticles = positiveArticles.slice(0, 6);
        const selectedGeneralArticles = generalArticles.slice(0, 3);

        let selectedArticles = [
          ...selectedPositiveArticles,
          ...selectedGeneralArticles,
        ];

        /*
          If we do not yet have nine stories, fill the remaining spots
          with the best unused, non-blocked stories.

          Positive stories still appear first in this fallback pool.
        */
        if (selectedArticles.length < 9) {
          const selectedKeys = new Set(
            selectedArticles.map(
              (article) => article.uuid || article.url
            )
          );

          const fallbackArticles = scoredArticles
            .filter((article) => {
              const articleKey = article.uuid || article.url;

              return (
                !selectedKeys.has(articleKey) &&
                !article.blockedTopic &&
                article.communityScore >= -5
              );
            })
            .sort((articleA, articleB) => {
              const scoreDifference =
                articleB.communityScore -
                articleA.communityScore;

              if (scoreDifference !== 0) {
                return scoreDifference;
              }

              return (
                new Date(articleB.published_at).getTime() -
                new Date(articleA.published_at).getTime()
              );
            });

          selectedArticles = [
            ...selectedArticles,
            ...fallbackArticles.slice(
              0,
              9 - selectedArticles.length
            ),
          ];
        }

        /*
          Mix the selected articles so all positive stories do not
          appear in one block followed by all general stories.
        */
        const shuffledArticles = [...selectedArticles];

        for (let i = shuffledArticles.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));

          [shuffledArticles[i], shuffledArticles[j]] = [
            shuffledArticles[j],
            shuffledArticles[i],
          ];
        }

        setArticles(shuffledArticles.slice(0, 9));

        /*
          Testing information.

          Open the browser console to see which search produced each
          article and why it was selected or rejected.
        */
        console.log("News cutoff date:", publishedAfter);

        results.forEach((result) => {
          console.log(
            `${result.searchLabel}:`,
            result.data || []
          );
        });

        console.table(
          scoredArticles.map((article) => ({
            title: article.title,
            source: article.source,
            date: article.published_at,
            score: article.communityScore,
            blocked: article.blockedTopic,
            search: article.searchLabel,
          }))
        );

        console.log("Positive articles:", positiveArticles);
        console.log("General articles:", generalArticles);
        console.log("Selected articles:", shuffledArticles);
      } catch (err) {
        console.error("Unable to load Around Niagara stories:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchLocalNews();
  }, []);

  if (error) {
    return (
      <section className="localNewsSection">
        <div className="localNewsInner">
          <div className="localNewsHeader">
            <p className="eyebrow dark">
              Events & Community
            </p>

            <h2>Around Niagara.</h2>
          </div>

          <p className="localNewsLoading">
            Around Niagara is temporarily unavailable.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="localNewsSection">
      <div className="localNewsInner">
        <div className="localNewsHeader">
          <p className="eyebrow dark">
            Events & Community
          </p>

          <h2>Around Niagara.</h2>

          <p>
            Discover upcoming events, community celebrations,
            local attractions and noteworthy stories from Fort Erie,
            Niagara Falls and across the Niagara Region.
          </p>
        </div>

        {loading ? (
          <p className="localNewsLoading">
            Finding what&apos;s happening around Niagara...
          </p>
        ) : articles.length > 0 ? (
          <div className="localNewsGrid">
            {articles.map((article) => (
              <article
                className="newsCard"
                key={article.uuid || article.url}
              >
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="newsImageLink"
                  aria-label={`Read: ${article.title}`}
                >
                  <NewsImage article={article} />
                </a>

                <div className="newsCardContent">
                  <div className="newsMeta">
                    {article.source && (
                      <span>{article.source}</span>
                    )}

                    {article.published_at && (
                      <span>
                        {new Date(
                          article.published_at
                        ).toLocaleDateString("en-CA", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  <h3>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.title}
                    </a>
                  </h3>

                  {(article.description || article.snippet) && (
                    <p>
                      {article.description || article.snippet}
                    </p>
                  )}

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="newsReadMore"
                  >
                    Read Story →
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="localNewsLoading">
            No recent community stories are available right now.
          </p>
        )}
      </div>
    </section>
  );
}

export default LocalNews;