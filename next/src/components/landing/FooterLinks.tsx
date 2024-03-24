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
    className="group w-full rounded-full bg-transparent px-2 text-sm text-white/50 transition-colors duration-300 ease-in-out hover:text-white/90"
  >
    {children}
  </a>
);

const FooterLinks = () => {
  return (
    <div className="hidden cursor-pointer flex-row justify-center space-x-4 lg:flex">
      <FooterLink href="https://www.ycombinator.com/companies/reworkd/jobs">Careers</FooterLink>
      <FooterLink href="https://status.reworkd.ai">
        <div className="flex items-center gap-3">
          <p>Status</p>
          <div className="h-[6px] w-[6px] animate-pulse items-center justify-center rounded-full bg-green-500 ring-[3px] ring-green-500 ring-opacity-60"></div>
        </div>
      </FooterLink>
      <FooterLink href="https://agentgpt.reworkd.ai/privacypolicy">Privacy</FooterLink>
      <FooterLink href="https://agentgpt.reworkd.ai/terms">Terms</FooterLink>
    </div>
  );
};

export default FooterLinks;
