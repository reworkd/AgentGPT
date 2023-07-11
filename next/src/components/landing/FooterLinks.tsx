import clsx from "clsx";

const FooterLink = ({ href, children }) => (
  <a
    href={href}
    className={clsx(
      "rounded-full bg-transparent text-white/60 ",
      "transition duration-200 ease-in-out hover:text-white/90"
    )}
  >
    {children}
  </a>
);

const FooterLinks = () => {
  return (
    <div className="flex cursor-pointer justify-between space-x-4">
      <FooterLink href="https://www.ycombinator.com/companies/reworkd/jobs">Careers</FooterLink>
      <div className="flex items-center space-x-2">
        <div className="text-white/60">Status</div>
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
      </div>
      <FooterLink href="https://agentgpt.reworkd.ai/privacypolicy">Privacy</FooterLink>
      <FooterLink href="https://agentgpt.reworkd.ai/terms">Terms</FooterLink>
    </div>
  );
};

export default FooterLinks;
