import type { FC, ReactNode } from "react";

interface FooterLinkProps {
  href: string;
  children: ReactNode;
}

const FooterLink: FC<FooterLinkProps> = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group w-full rounded-full bg-transparent text-sm text-white/50 transition-colors duration-300 ease-in-out hover:text-white/90"
  >
    {children}
  </a>
);

const FooterLinks = () => {
  return (
    <div className="flex cursor-pointer justify-evenly space-x-8">
      <FooterLink href="https://www.ycombinator.com/companies/reworkd/jobs">Careers</FooterLink>
      <FooterLink href="https://status.reworkd.ai">
        <div className="flex items-center gap-2">
          <p>Status</p>
          <div className="relative flex h-2 w-2 items-center justify-center rounded-full bg-green-500">
            <div className="absolute h-3.5 w-3.5 rounded-full bg-green-500 opacity-40 transition-opacity duration-300 group-hover:opacity-60"></div>
          </div>
        </div>
      </FooterLink>
      <FooterLink href="https://agentgpt.reworkd.ai/privacypolicy">Privacy</FooterLink>
      <FooterLink href="https://agentgpt.reworkd.ai/terms">Terms</FooterLink>
    </div>
  );
};

export default FooterLinks;
