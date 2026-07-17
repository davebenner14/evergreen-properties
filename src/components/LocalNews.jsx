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
          Create one API request for each local search.
        */
        const requests = searches.map((search) => {
          const url =
            `https://api.thenewsapi.com/v1/news/all` +
            `?api_token=${API_TOKEN}` +
            `&search=${encodeURIComponent(search)}` +
            `&language=en` +
            `&locale=ca` +
            `&limit=3`;

          return fetch(url).then((response) => {
            if (!response.ok) {
              throw new Error(
                `News API request failed with status ${response.status}`
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
          Combine the results from all three searches
          into one single array.
        */
        const combinedArticles = results.flatMap(
          (result) => result.data || []
        );

        /*
          Remove duplicate stories.

          The same news article could potentially appear
          in more than one search result.
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
          Randomly shuffle all of the combined stories.

          This prevents the cards from always appearing as:
          Fort Erie
          Fort Erie
          Fort Erie
          Niagara Falls
          Niagara Falls
          Niagara Falls
          etc.
        */
        const shuffledArticles = [...uniqueArticles];

        for (let i = shuffledArticles.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));

          [shuffledArticles[i], shuffledArticles[j]] = [
            shuffledArticles[j],
            shuffledArticles[i],
          ];
        }

        /*
          Display up to 9 randomly mixed stories.
        */
        setArticles(shuffledArticles.slice(0, 9));

        /*
          Helpful while we're developing locally.
          You can view this in the browser console.
        */
        console.log("Fort Erie news:", results[0]?.data || []);
        console.log("Niagara Falls news:", results[1]?.data || []);
        console.log("Niagara Region news:", results[2]?.data || []);
        console.log("Combined local news:", combinedArticles);
        console.log("Unique local news:", uniqueArticles);
        console.log("Shuffled local news:", shuffledArticles);
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

    We can change this later so the entire section
    disappears automatically in production.
  */
  if (error) {
    return (
      <section className="localNewsSection">
        <div className="localNewsInner">
          <div className="localNewsHeader">
            <p className="eyebrow dark">Local News & Community</p>

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
          <p className="eyebrow dark">Local News & Community</p>

          <h2>Around Niagara.</h2>

          <p>
            Stay connected with what's happening in Fort Erie, Niagara Falls,
            and communities across the Niagara Region.
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
        ) : (
          <p className="localNewsLoading">
            No local news stories are available right now.
          </p>
        )}
      </div>
    </section>
  );
}

export default LocalNews;