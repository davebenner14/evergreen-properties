import { useEffect, useState } from "react";
import "./LocalNews.css";

function LocalNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchLocalNews() {
      try {
        const API_TOKEN =
          "0oLO56rvYVm8ITpWOOwIP4VtRctpIuIdyCUv9vgz";

        const searchQuery =
          '"Fort Erie" OR "Niagara Falls" OR "Niagara Region"';

        const url =
          `https://api.thenewsapi.com/v1/news/all` +
          `?api_token=${API_TOKEN}` +
          `&search=${encodeURIComponent(searchQuery)}` +
          `&language=en` +
          `&locale=ca` +
          `&limit=3`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `News API request failed with status ${response.status}`
          );
        }

        const data = await response.json();

        console.log("Local news response:", data);

        setArticles(data.data || []);
      } catch (err) {
        console.error("Unable to load local news:", err);
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
          <p>Local news is temporarily unavailable.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="localNewsSection">
      <div className="localNewsInner">
        <div className="localNewsHeader">
          <p className="eyebrow dark">Local News & Community</p>

          <h2>Around Niagara.</h2>

          <p>
            Stay connected with what's happening in Fort Erie, Niagara Falls,
            and communities across the Niagara Region.
          </p>
        </div>

        {loading ? (
          <p className="localNewsLoading">Loading local news...</p>
        ) : (
          <div className="localNewsGrid">
            {articles.map((article) => (
              <article className="newsCard" key={article.uuid}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="newsImageLink"
                >
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="newsCardImage"
                    />
                  ) : (
                    <div className="newsImageFallback">
                      <img
                        src="/logos/EPIcon.png"
                        alt="Evergreen Properties"
                      />
                    </div>
                  )}
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
        )}
      </div>
    </section>
  );
}

export default LocalNews;