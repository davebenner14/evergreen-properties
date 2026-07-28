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
      image.naturalWidth < 500 ||
      image.naturalHeight < 250;

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

/*
  Creates a normalized version of an article title.

  This helps remove duplicate stories when the same article
  appears in more than one search result.
*/
function normalizeTitle(title = "") {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/*
  Randomly shuffles an array without changing the original.
*/
function shuffleArray(items) {
  const shuffledItems = [...items];

  for (let i = shuffledItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffledItems[i], shuffledItems[j]] = [
      shuffledItems[j],
      shuffledItems[i],
    ];
  }

  return shuffledItems;
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
          We use five searches:

          1. General Fort Erie coverage
          2. General Niagara Falls coverage
          3. General Niagara Region coverage
          4. Niagara This Week Fort Erie coverage
          5. Niagara This Week Niagara Falls coverage

          The Niagara This Week searches are restricted to
          niagarathisweek.com using the API's domains parameter.
        */
        const searches = [
          {
            label: "Fort Erie general",
            query: "Fort Erie Ontario",
          },
          {
            label: "Niagara Falls general",
            query: "Niagara Falls Ontario",
          },
          {
            label: "Niagara Region general",
            query: "Niagara Region Ontario",
          },
          {
            label: "Niagara This Week Fort Erie",
            query: "Fort Erie",
            domain: "niagarathisweek.com",
          },
          {
            label: "Niagara This Week Niagara Falls",
            query: "Niagara Falls",
            domain: "niagarathisweek.com",
          },
        ];

        /*
          Search within the last 90 days.

          Thirty days produced too few local results, while
          90 days should still keep the feed reasonably current.
        */
        const cutoffDate = new Date();

        cutoffDate.setDate(cutoffDate.getDate() - 90);
        cutoffDate.setHours(0, 0, 0, 0);

        /*
          The API expects YYYY-MM-DD.
        */
        const publishedAfter = cutoffDate
          .toISOString()
          .split("T")[0];

        /*
          Create one API request for every search.
        */
        const requests = searches.map(async (search) => {
          const params = new URLSearchParams({
            api_token: API_TOKEN,
            search: search.query,
            search_fields: "title,description,keywords,main_text",
            language: "en",
            locale: "ca",
            published_after: publishedAfter,
            sort: "published_at",
            limit: "3",
          });

          /*
            Only include the domains parameter for the dedicated
            Niagara This Week searches.
          */
          if (search.domain) {
            params.set("domains", search.domain);
          }

          const url =
            `https://api.thenewsapi.com/v1/news/all?${params.toString()}`;

          const response = await fetch(url);

          if (!response.ok) {
            const errorBody = await response.text();

            throw new Error(
              `${search.label} request failed with status ` +
                `${response.status}: ${errorBody}`
            );
          }

          const result = await response.json();

          /*
            Add internal information showing which search produced
            each article. This is helpful while testing.
          */
          return {
            label: search.label,
            data: (result.data || []).map((article) => ({
              ...article,
              searchLabel: search.label,
              isNiagaraThisWeek:
                article.domain === "niagarathisweek.com" ||
                article.url?.includes("niagarathisweek.com"),
            })),
          };
        });

        /*
          Promise.allSettled allows the remaining requests to work
          even if one particular search or source fails.
        */
        const settledResults = await Promise.allSettled(requests);

        const successfulResults = settledResults
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);

        const failedResults = settledResults.filter(
          (result) => result.status === "rejected"
        );

        failedResults.forEach((result) => {
          console.warn(
            "A local-news search failed:",
            result.reason
          );
        });

        /*
          If every request failed, show the error state.
        */
        if (successfulResults.length === 0) {
          throw new Error("All local-news requests failed.");
        }

        /*
          Combine all successful results.

          We also apply our own date filter in the browser so an
          incorrectly dated or old article cannot reach the page.
        */
        const combinedArticles = successfulResults
          .flatMap((result) => result.data || [])
          .filter((article) => {
            if (
              !article.url ||
              !article.title ||
              !article.published_at
            ) {
              return false;
            }

            const publishedDate = new Date(
              article.published_at
            );

            if (Number.isNaN(publishedDate.getTime())) {
              return false;
            }

            return publishedDate >= cutoffDate;
          });

        /*
          Remove duplicates.

          We check UUID, URL and normalized title because the same
          story can sometimes have slightly different API records.
        */
        const articleMap = new Map();

        combinedArticles.forEach((article) => {
          const articleKey =
            article.uuid ||
            article.url ||
            normalizeTitle(article.title);

          if (!articleMap.has(articleKey)) {
            articleMap.set(articleKey, article);
          }
        });

        /*
          Run a second title-based duplicate check.
        */
        const titleMap = new Map();

        Array.from(articleMap.values()).forEach((article) => {
          const titleKey = normalizeTitle(article.title);

          const existingArticle = titleMap.get(titleKey);

          /*
            If two records have the same title, prefer the
            Niagara This Week version.
          */
          if (
            !existingArticle ||
            article.isNiagaraThisWeek
          ) {
            titleMap.set(titleKey, article);
          }
        });

        const uniqueArticles = Array.from(
          titleMap.values()
        );

        /*
          Separate Niagara This Week stories from the broader
          local-news pool.

          We prioritize Niagara This Week because its community
          pages better match the tone you want.
        */
        const niagaraThisWeekArticles = uniqueArticles
          .filter((article) => article.isNiagaraThisWeek)
          .sort(
            (articleA, articleB) =>
              new Date(articleB.published_at).getTime() -
              new Date(articleA.published_at).getTime()
          );

        const generalArticles = uniqueArticles
          .filter((article) => !article.isNiagaraThisWeek)
          .sort(
            (articleA, articleB) =>
              new Date(articleB.published_at).getTime() -
              new Date(articleA.published_at).getTime()
          );

        /*
          Try to include up to six Niagara This Week stories,
          then fill the remaining spaces with general stories.
        */
        const selectedNiagaraThisWeek =
          niagaraThisWeekArticles.slice(0, 6);

        const remainingSpaces =
          9 - selectedNiagaraThisWeek.length;

        const selectedGeneralArticles =
          generalArticles.slice(0, remainingSpaces);

        const selectedArticles = [
          ...selectedNiagaraThisWeek,
          ...selectedGeneralArticles,
        ];

        /*
          Randomly mix the selected stories so they are not
          visibly grouped by source.
        */
        const shuffledArticles =
          shuffleArray(selectedArticles);

        setArticles(shuffledArticles);

        /*
          Development logs.

          Check the browser console to confirm whether The News API
          has Niagara This Week indexed and which stories it returns.
        */
        console.log("News cutoff date:", publishedAfter);

        successfulResults.forEach((result) => {
          console.log(
            `${result.label}:`,
            result.data || []
          );
        });

        console.log(
          "Failed news searches:",
          failedResults
        );

        console.log(
          "Combined recent articles:",
          combinedArticles
        );

        console.log(
          "Unique articles:",
          uniqueArticles
        );

        console.log(
          "Niagara This Week articles:",
          niagaraThisWeekArticles
        );

        console.log(
          "General articles:",
          generalArticles
        );

        console.log(
          "Final displayed articles:",
          shuffledArticles
        );
      } catch (err) {
        console.error(
          "Unable to load local news:",
          err
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchLocalNews();
  }, []);

  /*
    If every API request fails, display a simple message.
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
            Discover community stories, local events and important
            updates from Fort Erie, Niagara Falls and communities
            across the Niagara Region.
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
                key={
                  article.uuid ||
                  article.url ||
                  article.title
                }
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

                  {(article.description ||
                    article.snippet) && (
                    <p>
                      {article.description ||
                        article.snippet}
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
            No recent local stories are available right now.
          </p>
        )}
      </div>
    </section>
  );
}

export default LocalNews;