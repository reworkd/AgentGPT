import clsx from "clsx";

const FooterLink = ({ href, children }) => (
  <a
    href={href}
    className={clsx(
      "w-full rounded-full bg-transparent text-white/20 ",
      "transition duration-200 ease-in-out hover:text-white/90",
      " focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-transparent"
    )}
  >
    {children}
  </a>
);

const FooterLinks = () => {
  return (
    <div className="flex cursor-pointer justify-between space-x-8">
      <FooterLink href="https://www.ycombinator.com/companies/reworkd/jobs">Careers</FooterLink>
      <div className="group flex items-center space-x-2">
        <div className="pr-1 text-white/20">Status</div>
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
