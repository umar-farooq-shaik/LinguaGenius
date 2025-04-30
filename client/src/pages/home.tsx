import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Translator from "@/components/translator";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-200">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 lg:py-8">
        <Translator />
      </main>
      <Footer />
    </div>
  );
}
