import Link from "next/link";
import Image from "next/image";
import { Twitter, Youtube, Github } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image src="/logo.svg" alt="Lexi Logo" width={32} height={32} />
              <span className="text-xl font-bold text-foreground">Lexi</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              AI-powered contract assistant for freelancers and creators. Decode
              contracts, get negotiation suggestions, know what you need to
              track and when.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  href="https://adedoyin.hashnode.dev/my-experience-at-the-co-creating-with-gpt-5-hackathon-by-aimlapi"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  How it works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://x.com/Emmysoft_Tm"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:adedoyine535@gmail.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            All rights reserved &copy; {year} Lexi
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link
              href="https://github.com/Adedoyin-Emmanuel/lexi"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            <Link
              href="https://x.com/Emmysoft_Tm"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            <Link
              href="https://www.youtube.com/watch?v=SoHnV4Ikkjc"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Youtube className="w-5 h-5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
