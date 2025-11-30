import type { Metadata } from "next";

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    canonical?: string;
}

export function generateSEOMetadata({
    title = "NapiFit",
    description = "NapiFit - Supabase destekli fitness ve sağlık takip uygulaması. Öğün, egzersiz ve su takibi, AI koçluk, topluluk özellikleri.",
    keywords = ["fitness", "sağlık", "beslenme", "egzersiz", "takip", "AI koç"],
    ogImage = "/og-image.png",
    canonical,
}: SEOProps = {}): Metadata {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://napifit.vercel.app";

    return {
        title,
        description,
        keywords: keywords.join(", "),
        authors: [{ name: "NapiBase" }],
        creator: "NapiBase",
        publisher: "NapiBase",
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            type: "website",
            locale: "tr_TR",
            url: canonical || baseUrl,
            title,
            description,
            siteName: "NapiFit",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
            creator: "@napibase",
        },
        alternates: {
            canonical: canonical || baseUrl,
        },
    };
}
