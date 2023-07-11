const FooterLink = ({ href, children }) => (
  <a
    href={href}
    className="rounded-full bg-transparent text-white/60 transition duration-200 ease-in-out hover:bg-neutral-900 hover:text-neutral-100 focus-visible:bg-neutral-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-500"
  >
    {children}
  </a>
);

const FooterLinks = () => {
  return (
    <div className="flex cursor-pointer justify-between space-x-4">
      <FooterLink href="#https://www.ycombinator.com/companies/reworkd/jobs">Careers</FooterLink>
      <div className="flex items-center space-x-2">
        <div className="text-white/60">Status</div>
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
      </div>
      <FooterLink href="#https://agentgpt.reworkd.ai/privacypolicy">Privacy</FooterLink>
      <FooterLink href="#https://agentgpt.reworkd.ai/terms">Terms</FooterLink>
    </div>
  );
};

export default FooterLinks;
