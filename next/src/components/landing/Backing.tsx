import YCLogo from "../../../public/logos/yc-default-solid.svg";
import PanacheLogo from "../../../public/logos/panache-default-solid.svg";

const Backing = () => {
  return (
    <div className="relative flex flex-col items-center font-inter text-xs font-normal text-white/50 md:text-sm">
      <div className="flex flex-row items-center gap-x-1">
        <div className="ml-2 mr-1 flex flex-row items-center">
          <YCLogo className="z-10 -mr-2" />
          <PanacheLogo />
        </div>
        <div className="tracking-wide">Backed By</div>
        <a
          className="flex cursor-pointer flex-row items-center gap-1 font-medium text-white/95 transition-transform duration-300 hover:scale-105"
          href="https://www.ycombinator.com/companies/reworkd"
          target="_blank"
        >
          Y Combinator
        </a>
        <span>and</span>
        <a
          className="cursor-pointer font-medium text-white/95 transition-transform duration-300 hover:scale-105"
          href="https://www.panache.vc/"
          target="_blank"
        >
          Panache Ventures
        </a>
      </div>
    </div>
  );
};

export default Backing;
