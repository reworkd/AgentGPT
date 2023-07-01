const Backing = () => {
  return (
    <div className="font-white relative flex flex-col items-center text-xs md:text-sm">
      <div className="flex flex-row items-center gap-1 font-thin text-gray-400">
        <div className="mr-1 font-thin">Backed By:</div>
        <a
          className="flex cursor-pointer flex-row items-center gap-1 transition-transform duration-300 hover:scale-105"
          href="https://www.ycombinator.com/companies/reworkd"
          target="_blank"
        >
          <div className="relative p-[1px]">
            <div className="absolute inset-0 bg-gray-400"></div>
            <div className="relative flex items-center justify-center px-2 font-sans text-lg text-black">
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
