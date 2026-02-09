import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    keywords?: string[];
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
}

export const SEO = ({
    title = "LUVNEST - Create Beautiful Love Pages",
    description = "Create stunning digital love pages to share with your special someone. AI-powered content, beautiful themes, and romantic animations.",
    image = "/og-image.png",
    url = "https://luvnest.app/",
    type = "website",
    keywords = [
        "luvnest",
        "love page",
        "romantic",
        "digital card",
        "AI love story",
        "anniversary",
        "couple",
        "gift",
    ],
    author = "LUVNEST",
    publishedTime,
    modifiedTime,
}: SEOProps) => {
    const siteTitle = title === "LUVNEST - Create Beautiful Love Pages" ? title : `${title} | LUVNEST`;
    const metaKeywords = Array.isArray(keywords) ? keywords.join(", ") : keywords;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{siteTitle}</title>
            <meta name="title" content={siteTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={metaKeywords} />
            <meta name="author" content={author} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="LUVNEST" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Article Specific Meta Tags */}
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

            {/* Canonical URL */}
            <link rel="canonical" href={url} />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "LUVNEST",
                    "url": "https://luvnest.app/",
                    "description": description,
                    "author": {
                        "@type": "Organization",
                        "name": "LUVNEST"
                    }
                })}
            </script>
        </Helmet>
    );
};
