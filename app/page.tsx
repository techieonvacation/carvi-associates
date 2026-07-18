import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";

export default function Home() {
  return (
    <div className="findox-scope page-wrapper">
      <Header />
      <main>
        <Hero />
      </main>
    </div>
  );
}
