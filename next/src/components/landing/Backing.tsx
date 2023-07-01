const Backing = () => {
  return (
    <div className="font-white relative z-40 flex flex-col items-center text-xs md:text-sm">
      <div className="flex flex-row items-center gap-2 font-thin text-[#9A9A9A]">
        <a
          className="flex cursor-pointer flex-row items-center gap-1 transition-transform duration-300 hover:scale-105"
          href="https://www.ycombinator.com/companies/reworkd"
          target="_blank"
        >
          <div className="mr-1 font-thin">Backed By:</div>
          <div className="relative p-[1px]">
            <div className="absolute inset-0 rotate-180 bg-[#9A9A9A]"></div>
            <div className="relative flex items-center justify-center bg-[#9A9A9A] px-2 text-lg font-thin text-black">
              Y
            </div>
          </div>
          <div>Combinator</div>
        </a>
        <div>&</div>
        <a
          className="cursor-pointer transition-transform duration-300 hover:scale-105"
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
