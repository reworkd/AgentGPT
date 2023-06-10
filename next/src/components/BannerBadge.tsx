import { FaArrowRight } from "react-icons/fa";
import clsx from "clsx";

type BannerBadgeProps = {
  children: string;
  onClick: () => void;
};

const BannerBadge = ({ children, onClick }: BannerBadgeProps) => {
  return (
    <div
      className={clsx(
        "flex w-max cursor-pointer items-center gap-2 rounded-full border border-blue-300 bg-blue-500/40 px-3 py-1 text-xs text-blue-300",
        "hover:border-blue-200 hover:bg-blue-500/60 hover:text-blue-200",
        "transition-colors duration-300"
      )}
      onClick={onClick}
    >
      <span>{children}</span>
      <FaArrowRight />
    </div>
  );
};

export default BannerBadge;
