import clsx from "clsx";

type BannerBadgeProps = {
  children: string;
  onClick: () => void;
};

const BannerBadge = ({ children, onClick }: BannerBadgeProps) => {
  return (
    <div
      className={clsx(
        "cursor-pointeritems-center relative flex w-max gap-2 overflow-hidden rounded-full border p-1 px-2",
        "text-xs text-[#CC98FF] transition-colors duration-300"
      )}
      onClick={onClick}
    >
      <span>{children}</span>
      <div className="animate-glow absolute inset-0 rounded-full border-blue-300 border-opacity-0" />
    </div>
  );
};

export default BannerBadge;
