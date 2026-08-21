import { Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { ArticleDetailPage } from "../features/articles/ArticleDetailPage";
import { ArticlesPage } from "../features/articles/ArticlesPage";
import { ChatWidget } from "../features/chatbot/ChatWidget";
import { ConsultationPage } from "../features/consultation/ConsultationPage";
import { HomePage } from "../features/home/HomePage";
import { LearningPage } from "../features/learning/LearningPage";
import { ProjectsPage } from "../features/projects/ProjectsPage";
import { I18nProvider } from "../i18n/I18nContext";
import { ThemeProvider } from "../theme/ThemeContext";
import { NotFound } from "./NotFound";

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/artikel" element={<ArticlesPage />} />
            <Route path="/artikel/:slug" element={<ArticleDetailPage />} />
            <Route path="/belajar" element={<LearningPage />} />
            <Route path="/proyek" element={<ProjectsPage />} />
            <Route path="/konsultasi" element={<ConsultationPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
        <ChatWidget />
      </I18nProvider>
    </ThemeProvider>
  );
}
