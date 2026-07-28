import { useEffect, useState } from "react";
import "./LocalNews.css";

/*
  Handles each article image independently.

  If an image is missing, blocked, broken or too small,
  the Evergreen Properties fallback is displayed.
*/
function NewsImage({ article }) {
  const [imageFailed, setImageFailed] =
    useState(!article.image_url);

  function handleImageLoad(event) {
    const image = event.currentTarget;

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

        <span>
          {article.community ||
            "Around Niagara"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={article.image_url}
      alt={
        article.title ||
        "Local Niagara story"
      }
      className="newsCardImage"
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={handleImageLoad}
      onError={handleImageError}
    />
  );
}

function formatArticleDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString(
    "en-CA",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function LocalNews() {
  const [articles, setArticles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    const controller =
      new AbortController();

    async function fetchLocalNews() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          "/api/local-news",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          const errorBody =
            await response.text();

          throw new Error(
            `Local-news endpoint returned ` +
              `${response.status}: ${errorBody}`
          );
        }

        const result =
          await response.json();

        setArticles(
          Array.isArray(result.articles)
            ? result.articles
            : []
        );

        console.log(
          "Local-news response:",
          result
        );
      } catch (fetchError) {
        if (
          fetchError.name ===
          "AbortError"
        ) {
          return;
        }

        console.error(
          "Unable to load local news:",
          fetchError
        );

        setError(true);
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    }

    fetchLocalNews();

    return () => {
      controller.abort();
    };
  }, []);

  if (error) {
    return (
      <section className="localNewsSection">
        <div className="localNewsInner">
          <div className="localNewsHeader">
            <p className="eyebrow dark">
              Local News & Community
            </p>

            <h2>
              Around Niagara.
            </h2>
          </div>

          <p className="localNewsLoading">
            Local news is temporarily
            unavailable.
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

          <h2>
            Around Niagara.
          </h2>

          <p>
            Discover recent community
            stories, local events and
            important updates from Fort
            Erie, Niagara Falls and across
            the Niagara Region.
          </p>
        </div>

        {loading ? (
          <p className="localNewsLoading">
            Loading what&apos;s happening
            around Niagara...
          </p>
        ) : articles.length > 0 ? (
          <div className="localNewsGrid">
            {articles.map(
              (article, index) => {
                const formattedDate =
                  formatArticleDate(
                    article.published_at
                  );

                return (
                  <article
                    className="newsCard"
                    key={
                      article.uuid ||
                      article.url ||
                      `${article.title}-${index}`
                    }
                  >
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="newsImageLink"
                      aria-label={`Read: ${article.title}`}
                    >
                      <NewsImage
                        article={article}
                      />
                    </a>

                    <div className="newsCardContent">
                      <div className="newsMeta">
                        {article.source && (
                          <span>
                            {article.source}
                          </span>
                        )}

                        {article.community && (
                          <span>
                            {article.community}
                          </span>
                        )}

                        {formattedDate && (
                          <span>
                            {formattedDate}
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
                );
              }
            )}
          </div>
        ) : (
          <p className="localNewsLoading">
            No recent community stories
            are available right now.
          </p>
        )}
      </div>
    </section>
  );
}

export default LocalNews;