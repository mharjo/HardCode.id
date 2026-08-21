import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { SeoHead } from "../../components/seo/SeoHead";
import { faqItems } from "../../data/faq";
import { services } from "../../data/services";
import { useI18n } from "../../i18n/I18nContext";
import { applyOrganizationJsonLd } from "../../lib/seo";
import { ArticlesPreviewSection } from "./ArticlesPreviewSection";
import { FaqSection } from "./FaqSection";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { ServicesSection } from "./ServicesSection";
import { TestimonialsSection } from "./TestimonialsSection";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function HomePage() {
  const { t } = useI18n();
  const { hash } = useLocation();
  const [query, setQuery] = useState("");
  const normalizedQuery = normalize(query);

  useEffect(() => {
    applyOrganizationJsonLd();
  }, []);

  // Supports Header nav links from other routes (e.g. `/artikel` -> `/#layanan`)
  // by scrolling to the target section once we've landed back on the homepage.
  useEffect(() => {
    if (!hash) return;
    const target = document.querySelector(hash);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  const filteredServices = useMemo(() => {
    if (!normalizedQuery) return services;
    return services.filter((service) => {
      const haystack = [
        t(service.titleKey),
        t(service.descKey),
        t(service.taglineKey),
        ...service.searchTerms,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery, t]);

  const filteredFaq = useMemo(() => {
    if (!normalizedQuery) return faqItems;
    return faqItems.filter((item) => {
      const haystack = [t(item.questionKey), t(item.answerKey), ...item.searchTerms].join(" ").toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery, t]);

  const resultCount = normalizedQuery ? filteredServices.length + filteredFaq.length : null;

  return (
    <>
      <SeoHead titleKey="seo_home_title" descKey="seo_home_desc" path="/" ogType="website" />
      <HeroSection query={query} onQueryChange={setQuery} resultCount={resultCount} />
      <ServicesSection services={filteredServices} />
      <HowItWorksSection />
      <FaqSection items={filteredFaq} />
      <TestimonialsSection />
      <ArticlesPreviewSection />
    </>
  );
}
