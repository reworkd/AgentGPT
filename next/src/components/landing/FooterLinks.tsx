interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children, className }) => (
  <a
    href={href}
    className={`w-full rounded-full bg-transparent text-sm text-white/50 transition 
    duration-200 ease-in-out hover:text-white/90 ${className}`}
  >
    {children}
  </a>
);

const FooterLinks: React.FC = () => {
  return (
    <div className="flex cursor-pointer justify-evenly space-x-8">
      <FooterLink href="https://www.ycombinator.com/companies/reworkd/jobs">Careers</FooterLink>
      <div className="group flex items-center space-x-2 text-sm">
        <div className="pr-1 text-white/50">Status</div>
        <div className="relative flex h-2 w-2 items-center justify-center rounded-full bg-green-500">
          <div className="absolute h-4 w-4 rounded-full bg-green-500 opacity-50 transition-opacity duration-200"></div>
        </div>
      </div>
      <FooterLink href="https://agentgpt.reworkd.ai/privacypolicy">Privacy</FooterLink>
      <FooterLink href="https://agentgpt.reworkd.ai/terms">Terms</FooterLink>
    </div>
  );
};

export default FooterLinks;
