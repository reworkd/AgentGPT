const Backing = () => {
  return (
    <div className="font-white flex flex-col items-center text-xs md:text-sm">
      <div className="font-thin">Backed by</div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex cursor-pointer flex-row items-center gap-1 font-bold transition-transform duration-300 hover:scale-105">
          <div className="relative p-[1px]">
            <div className="absolute inset-0 rotate-180 rounded-lg bg-gradient-to-br from-orange-100 via-orange-400 to-orange-700"></div>
            <div className="relative flex items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700 px-1.5 py-0.5">
              Y
            </div>
          </div>
          <div>Combinator</div>
        </div>
        <div className="font-thin">&</div>
        <div className="cursor-pointer font-bold transition-transform duration-300 hover:scale-105">
          Panache ventures
        </div>
      </div>
    </div>
  );
};

export default Backing;
