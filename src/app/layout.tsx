import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { IntroLoader } from "@/components/intro-loader";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name }],
  openGraph: { title: site.name, description: site.description, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
};

/**
 * Runs before first paint: marks JS as available (so reveal targets can start
 * hidden) and decides whether the intro plays (once per session, never with
 * reduced motion). Safety nets release the page if hydration ever fails.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');
var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches,seen=false;
try{seen=sessionStorage.getItem('intro')==='1'}catch(e){}
d.dataset.intro=(!rm&&!seen)?'play':'done';
setTimeout(function(){if(d.dataset.intro==='play'){d.dataset.intro='done';window.dispatchEvent(new Event('intro:done'))}},6000);
setTimeout(function(){d.classList.remove('js')},8000);})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${geistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[200] rounded-full bg-fg px-4 py-2 text-[13px] text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <IntroLoader />
          <Nav />
          <main id="main">{children}</main>
          <SiteFooter />
        </SmoothScroll>
      </body>
    </html>
  );
}
