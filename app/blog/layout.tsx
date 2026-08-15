import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSiteContent } from "@/lib/cms/queries";
import "@/components/site/css/blog.css";
import "@/components/blog/css/blog-page.css";

export const dynamic = "force-dynamic";

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();

  return (
    <div className="page-wrapper">
      <div className="findox-scope findox-header-inflow">
        <Header
          navItems={content.navItems}
          socialLinks={content.socialLinks}
          topbar={content.topbar}
          header={content.header}
        />
      </div>

      <main className="blog-scope bg-white">{children}</main>

      <div className="findox-scope">
        <Footer footer={content.footer} />
      </div>
    </div>
  );
}
