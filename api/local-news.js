import * as cheerio from "cheerio";

const NIAGARA_THIS_WEEK_BASE =
  "https://www.niagarathisweek.com";

const COMMUNITY_PAGES = [
  {
    community: "Fort Erie",
    url:
      "https://www.niagarathisweek.com/ontario-communities/fort-erie/",
  },
  {
    community: "Niagara Falls",
    url:
      "https://www.niagarathisweek.com/ontario-communities/niagara-falls/",
  },
];

const REQUEST_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; EvergreenProperties/1.0; local community news)",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-CA,en;q=0.9",
};

function createAbsoluteUrl(value, baseUrl) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value, baseUrl).href;
  } catch {
    return null;
  }
}

function normalizeText(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeTitle(value = "") {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "");
}

function isLikelyArticleUrl(url, communityPageUrl) {
  if (!url) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    const parsedCommunityPage = new URL(communityPageUrl);

    if (
      parsedUrl.hostname !== "www.niagarathisweek.com" &&
      parsedUrl.hostname !== "niagarathisweek.com"
    ) {
      return false;
    }

    const normalizedPath = parsedUrl.pathname.replace(/\/+$/, "");
    const communityPath =
      parsedCommunityPage.pathname.replace(/\/+$/, "");

    if (!normalizedPath || normalizedPath === communityPath) {
      return false;
    }

    const excludedFragments = [
      "/search",
      "/newsletters",
      "/account",
      "/login",
      "/privacy",
      "/terms",
      "/contact",
      "/about",
      "/contests",
      "/authors/",
      "/topics/",
      "/tags/",
    ];

    if (
      excludedFragments.some((fragment) =>
        normalizedPath.includes(fragment)
      )
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function getImageFromElement($, element, baseUrl) {
  const image = $(element).find("img").first();

  if (!image.length) {
    return null;
  }

  const srcSet =
    image.attr("srcset") ||
    image.attr("data-srcset");

  if (srcSet) {
    const candidates = srcSet
      .split(",")
      .map((candidate) => candidate.trim())
      .filter(Boolean);

    const largestCandidate =
      candidates[candidates.length - 1];

    const largestUrl =
      largestCandidate?.split(/\s+/)[0];

    const absoluteSrcSetUrl = createAbsoluteUrl(
      largestUrl,
      baseUrl
    );

    if (absoluteSrcSetUrl) {
      return absoluteSrcSetUrl;
    }
  }

  const source =
    image.attr("data-src") ||
    image.attr("data-lazy-src") ||
    image.attr("data-original") ||
    image.attr("src");

  return createAbsoluteUrl(source, baseUrl);
}

function getDateFromElement($, element) {
  const timeElement = $(element).find("time").first();

  const dateValue =
    timeElement.attr("datetime") ||
    timeElement.attr("content") ||
    timeElement.text();

  if (!dateValue) {
    return null;
  }

  const parsedDate = new Date(normalizeText(dateValue));

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString();
}

function extractArticleLinks(html, page) {
  const $ = cheerio.load(html);
  const candidates = [];
  const seenUrls = new Set();

  /*
    Community pages commonly place stories inside article,
    card, story or content-list containers.
  */
  const containerSelectors = [
    "article",
    '[class*="article"]',
    '[class*="story"]',
    '[class*="card"]',
    '[class*="teaser"]',
    '[class*="listing"]',
  ].join(",");

  $(containerSelectors).each((index, element) => {
    const headingLink = $(element)
      .find("h1 a, h2 a, h3 a, h4 a")
      .first();

    const fallbackLink = $(element)
      .find("a[href]")
      .first();

    const link = headingLink.length
      ? headingLink
      : fallbackLink;

    const href = createAbsoluteUrl(
      link.attr("href"),
      page.url
    );

    const title = normalizeText(
      headingLink.length
        ? headingLink.text()
        : $(element)
            .find("h1, h2, h3, h4")
            .first()
            .text() || link.text()
    );

    if (
      !href ||
      !title ||
      title.length < 15 ||
      seenUrls.has(href) ||
      !isLikelyArticleUrl(href, page.url)
    ) {
      return;
    }

    seenUrls.add(href);

    candidates.push({
      url: href,
      title,
      image_url: getImageFromElement(
        $,
        element,
        page.url
      ),
      published_at: getDateFromElement($, element),
      community: page.community,
      pagePosition: index,
    });
  });

  /*
    Fallback for layouts where stories are not wrapped in
    obvious article or card containers.
  */
  $("h2 a[href], h3 a[href], h4 a[href]").each(
    (index, element) => {
      const href = createAbsoluteUrl(
        $(element).attr("href"),
        page.url
      );

      const title = normalizeText($(element).text());

      if (
        !href ||
        !title ||
        title.length < 15 ||
        seenUrls.has(href) ||
        !isLikelyArticleUrl(href, page.url)
      ) {
        return;
      }

      seenUrls.add(href);

      const parent =
        $(element).closest(
          "article, div, section, li"
        );

      candidates.push({
        url: href,
        title,
        image_url: getImageFromElement(
          $,
          parent,
          page.url
        ),
        published_at: getDateFromElement($, parent),
        community: page.community,
        pagePosition: index + 100,
      });
    }
  );

  return candidates.slice(0, 10);
}

function getMetaContent($, selectors) {
  for (const selector of selectors) {
    const content = $(selector).attr("content");

    if (content) {
      return normalizeText(content);
    }
  }

  return null;
}

async function enrichArticle(candidate) {
  try {
    const response = await fetch(candidate.url, {
      headers: REQUEST_HEADERS,
    });

    if (!response.ok) {
      return candidate;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      getMetaContent($, [
        'meta[property="og:title"]',
        'meta[name="twitter:title"]',
      ]) ||
      normalizeText($("h1").first().text()) ||
      candidate.title;

    const description =
      getMetaContent($, [
        'meta[property="og:description"]',
        'meta[name="description"]',
        'meta[name="twitter:description"]',
      ]) || null;

    const imageUrl = createAbsoluteUrl(
      getMetaContent($, [
        'meta[property="og:image"]',
        'meta[name="twitter:image"]',
        'meta[property="twitter:image"]',
      ]),
      candidate.url
    );

    const publishedValue =
      getMetaContent($, [
        'meta[property="article:published_time"]',
        'meta[name="article:published_time"]',
        'meta[name="date"]',
        'meta[name="datePublished"]',
      ]) ||
      $("time").first().attr("datetime") ||
      $("time").first().attr("content");

    let publishedAt = candidate.published_at;

    if (publishedValue) {
      const parsedDate = new Date(publishedValue);

      if (!Number.isNaN(parsedDate.getTime())) {
        publishedAt = parsedDate.toISOString();
      }
    }

    return {
      ...candidate,
      title,
      description,
      image_url:
        imageUrl ||
        candidate.image_url ||
        null,
      published_at: publishedAt,
    };
  } catch (error) {
    console.warn(
      `Unable to enrich article ${candidate.url}:`,
      error
    );

    return candidate;
  }
}

async function scrapeCommunityPage(page) {
  const response = await fetch(page.url, {
    headers: REQUEST_HEADERS,
  });

  if (!response.ok) {
    throw new Error(
      `${page.community} page returned ${response.status}`
    );
  }

  const html = await response.text();

  const candidates = extractArticleLinks(
    html,
    page
  );

  /*
    Only open the first six article pages from each community.

    This gives us better titles, dates and images without making
    an excessive number of requests.
  */
  const enrichedArticles = await Promise.all(
    candidates
      .slice(0, 6)
      .map((candidate) =>
        enrichArticle(candidate)
      )
  );

  return enrichedArticles
    .map((article, index) => ({
      ...article,
      uuid:
        `niagara-this-week-${page.community}-${index}-` +
        Buffer.from(article.url)
          .toString("base64url")
          .slice(0, 18),
      source: "Niagara This Week",
      domain: "niagarathisweek.com",
      isNiagaraThisWeek: true,
      priority: 1,
      snippet: article.description || null,
    }))
    .filter(
      (article) =>
        article.url && article.title
    );
}

async function fetchAdditionalNews() {
  const apiToken = process.env.NEWS_API_TOKEN;

  /*
    The page still works without The News API.

    When no token is configured, it simply displays stories
    collected from the two Niagara This Week community pages.
  */
  if (!apiToken) {
    console.warn(
      "NEWS_API_TOKEN is missing. Skipping supplemental news."
    );

    return [];
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90);

  const searches = [
    "Fort Erie Ontario",
    "Niagara Falls Ontario",
    "Niagara Region Ontario community events",
  ];

  const requests = searches.map(async (search) => {
    const params = new URLSearchParams({
      api_token: apiToken,
      search,
      search_fields:
        "title,description,keywords",
      language: "en",
      locale: "ca",
      published_after: cutoffDate
        .toISOString()
        .split("T")[0],
      limit: "3",
    });

    const response = await fetch(
      `https://api.thenewsapi.com/v1/news/all?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        `Supplemental news returned ${response.status}`
      );
    }

    const result = await response.json();

    return result.data || [];
  });

  const results = await Promise.allSettled(
    requests
  );

  return results
    .filter(
      (result) => result.status === "fulfilled"
    )
    .flatMap((result) => result.value)
    .filter(
      (article) =>
        article.url &&
        article.title &&
        article.published_at
    )
    .map((article) => ({
      ...article,
      isNiagaraThisWeek: false,
      priority: 2,
    }));
}

function removeDuplicates(articles) {
  const articleMap = new Map();
  const titleMap = new Map();

  articles.forEach((article) => {
    const urlKey = article.url
      ?.split("?")[0]
      .replace(/\/+$/, "");

    const titleKey = normalizeTitle(
      article.title
    );

    if (
      (urlKey && articleMap.has(urlKey)) ||
      (titleKey && titleMap.has(titleKey))
    ) {
      return;
    }

    if (urlKey) {
      articleMap.set(urlKey, article);
    }

    if (titleKey) {
      titleMap.set(titleKey, article);
    }
  });

  return Array.from(articleMap.values());
}

function sortNewestFirst(articles) {
  return [...articles].sort(
    (articleA, articleB) => {
      const dateA = articleA.published_at
        ? new Date(
            articleA.published_at
          ).getTime()
        : 0;

      const dateB = articleB.published_at
        ? new Date(
            articleB.published_at
          ).getTime()
        : 0;

      if (dateA !== dateB) {
        return dateB - dateA;
      }

      return (
        (articleA.pagePosition ?? 999) -
        (articleB.pagePosition ?? 999)
      );
    }
  );
}

function interleaveCommunities(
  fortErieArticles,
  niagaraFallsArticles
) {
  const result = [];
  const maximumLength = Math.max(
    fortErieArticles.length,
    niagaraFallsArticles.length
  );

  for (
    let index = 0;
    index < maximumLength;
    index += 1
  ) {
    if (fortErieArticles[index]) {
      result.push(fortErieArticles[index]);
    }

    if (niagaraFallsArticles[index]) {
      result.push(
        niagaraFallsArticles[index]
      );
    }
  }

  return result;
}

export default async function handler(
  request,
  response
) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");

    return response.status(405).json({
      error: "Method not allowed.",
    });
  }

  try {
    const [
      communityResult,
      supplementalResult,
    ] = await Promise.all([
      Promise.allSettled(
        COMMUNITY_PAGES.map((page) =>
          scrapeCommunityPage(page)
        )
      ),
      fetchAdditionalNews(),
    ]);

    const scrapedArticles =
      communityResult
        .filter(
          (result) =>
            result.status === "fulfilled"
        )
        .flatMap((result) => result.value);

    communityResult
      .filter(
        (result) =>
          result.status === "rejected"
      )
      .forEach((result) => {
        console.warn(
          "A Niagara This Week page failed:",
          result.reason
        );
      });

    const fortErieArticles =
      sortNewestFirst(
        scrapedArticles.filter(
          (article) =>
            article.community === "Fort Erie"
        )
      );

    const niagaraFallsArticles =
      sortNewestFirst(
        scrapedArticles.filter(
          (article) =>
            article.community ===
            "Niagara Falls"
        )
      );

    /*
      Interleave the exact community-page stories:

      Fort Erie
      Niagara Falls
      Fort Erie
      Niagara Falls
      ...

      These stories occupy the first six positions.
    */
    const prioritizedCommunityArticles =
      interleaveCommunities(
        fortErieArticles,
        niagaraFallsArticles
      ).slice(0, 6);

    const selectedCommunityUrls = new Set(
      prioritizedCommunityArticles.map(
        (article) => article.url
      )
    );

    const unusedCommunityArticles =
      scrapedArticles.filter(
        (article) =>
          !selectedCommunityUrls.has(article.url)
      );

    const additionalArticles =
      sortNewestFirst(
        removeDuplicates([
          ...unusedCommunityArticles,
          ...supplementalResult,
        ])
      );

    const finalArticles =
      removeDuplicates([
        ...prioritizedCommunityArticles,
        ...additionalArticles,
      ]).slice(0, 9);

    if (finalArticles.length === 0) {
      return response.status(502).json({
        error:
          "No local stories could be retrieved.",
      });
    }

    /*
      Cache the result on Vercel for six hours.

      Visitors receive the cached feed instead of scraping the
      publisher every time someone opens your homepage.
    */
    response.setHeader(
      "Cache-Control",
      "s-maxage=21600, stale-while-revalidate=43200"
    );

    return response.status(200).json({
      articles: finalArticles,
      counts: {
        fortErie:
          fortErieArticles.length,
        niagaraFalls:
          niagaraFallsArticles.length,
        supplemental:
          supplementalResult.length,
      },
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "Unable to assemble local news:",
      error
    );

    return response.status(500).json({
      error:
        "Local news is temporarily unavailable.",
    });
  }
}