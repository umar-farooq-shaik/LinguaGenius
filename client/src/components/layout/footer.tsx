export default function Footer() {
  return (
    <footer className="py-4 px-6 border-t border-border text-center text-sm text-muted-foreground bg-card">
      <p>Powered by Google Gemini API | &copy; {new Date().getFullYear()} LinguaGenius Translator</p>
    </footer>
  );
}
