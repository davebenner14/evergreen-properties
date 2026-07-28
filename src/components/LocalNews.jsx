import { useEffect, useState } from "react";
import "./LocalNews.css";

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

        <span>Local News</span>
      </div>
    );
  }

  return (
    <img
      src={article.image_url}
      alt={article.title || "Local news story"}
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
          We run three separate searches so we get a better mix
          of stories from across the Niagara area.
        */
        const searches = [
          "Fort Erie Ontario",
          "Niagara Falls Ontario",
          "Niagara Region Ontario",
        ];

        /*
          Only request articles published within the last 30 days.
        */
        const cutoffDate = new Date();

        cutoffDate.setDate(cutoffDate.getDate() - 30);
        cutoffDate.setHours(0, 0, 0, 0);

        /*
          The API expects the date in YYYY-MM-DD format.
        */
        const publishedAfter = cutoffDate
          .toISOString()
          .split("T")[0];

        /*
          Create one API request for each local search.
        */
        const requests = searches.map((search) => {
          const url =
            `https://api.thenewsapi.com/v1/news/all` +
            `?api_token=${API_TOKEN}` +
            `&search=${encodeURIComponent(search)}` +
            `&search_fields=title,description,keywords` +
            `&language=en` +
            `&locale=ca` +
            `&published_after=${publishedAfter}` +
            `&limit=3`;

          return fetch(url).then(async (response) => {
            if (!response.ok) {
              const errorBody = await response.text();

              throw new Error(
                `News API request failed with status ` +
                  `${response.status}: ${errorBody}`
              );
            }

            return response.json();
          });
        });

        /*
          Run all three API requests at the same time.
        */
        const results = await Promise.all(requests);

        /*
          Combine all three result sets.

          We also apply our own date filter in the browser as
          a second layer of protection against old articles.
        */
        const combinedArticles = results
          .flatMap((result) => result.data || [])
          .filter((article) => {
            if (!article.published_at) {
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

          The same article could appear in more than one
          Niagara-area search.
        */
        const uniqueArticles = Array.from(
          new Map(
            combinedArticles.map((article) => [
              article.uuid || article.url,
              article,
            ])
          ).values()
        );

        /*
          Sort by publication date before mixing the stories.

          This ensures the newest available articles are handled
          first before the final nine-card selection.
        */
        const newestArticles = [...uniqueArticles].sort(
          (articleA, articleB) =>
            new Date(articleB.published_at).getTime() -
            new Date(articleA.published_at).getTime()
        );

        /*
          Randomly mix the recent stories so the grid is not
          grouped by Fort Erie, Niagara Falls, and Niagara Region.
        */
        const shuffledArticles = [...newestArticles];

        for (let i = shuffledArticles.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));

          [shuffledArticles[i], shuffledArticles[j]] = [
            shuffledArticles[j],
            shuffledArticles[i],
          ];
        }

        /*
          Display up to nine recent, randomly mixed stories.
        */
        setArticles(shuffledArticles.slice(0, 9));

        /*
          Helpful while developing locally.
        */
        console.log("News cutoff date:", publishedAfter);
        console.log("Fort Erie news:", results[0]?.data || []);
        console.log("Niagara Falls news:", results[1]?.data || []);
        console.log("Niagara Region news:", results[2]?.data || []);
        console.log("Recent combined news:", combinedArticles);
        console.log("Unique recent news:", uniqueArticles);
        console.log("Newest recent news:", newestArticles);
        console.log("Shuffled recent news:", shuffledArticles);
      } catch (err) {
        console.error("Unable to load local news:", err);

        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchLocalNews();
  }, []);

  /*
    If the API fails, display a simple message.
  */
  if (error) {
    return (
      <section className="localNewsSection">
        <div className="localNewsInner">
          <div className="localNewsHeader">
            <p className="eyebrow dark">
              Local News & Community
            </p>

            <h2>Around Niagara.</h2>
          </div>

          <p className="localNewsLoading">
            Local news is temporarily unavailable.
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
            Local News & Community
          </p>

          <h2>Around Niagara.</h2>

          <p>
            Stay connected with what's happening in Fort Erie,
            Niagara Falls, and communities across the Niagara Region.
          </p>
        </div>

        {loading ? (
          <p className="localNewsLoading">
            Loading local news...
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
            No local news stories have been published within the
            last 30 days.
          </p>
        )}
      </div>
    </section>
  );
}

export default LocalNews;