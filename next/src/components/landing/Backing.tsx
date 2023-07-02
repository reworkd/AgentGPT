const Backing = () => {
  return (
    <div className="font-white relative flex flex-col items-center text-xs md:text-sm">
      <div className="flex flex-row items-center gap-1 font-thin text-gray-400">
        <div className="mr-1 font-thin tracking-wide">Backed By:</div>
      </div>
      <div className="flex flex-row items-center gap-1 font-thin tracking-wide text-gray-400">
        <a
          className="flex cursor-pointer flex-row items-center gap-1 transition-transform duration-300 hover:-translate-x-0.5 hover:scale-105"
          href="https://www.ycombinator.com/companies/reworkd"
          target="_blank"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-sm bg-gradient-to-bl from-orange-50 via-orange-500 to-[#f26522]"></div>
            <div className="absolute inset-[2px] rounded-sm bg-gradient-to-t from-[#f26522] to-[#ffa437] ring-1 ring-[#f26522]/50"></div>
            <div className="relative flex items-center justify-center px-2 font-sans text-lg font-medium text-white">
              Y
            </div>
          </div>
          <div className="ml-1">Combinator</div>
        </a>
        <div className="mx-1 font-medium">&</div>
        <a
          className="cursor-pointer transition-transform duration-300 hover:translate-x-0.5 hover:scale-105"
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
