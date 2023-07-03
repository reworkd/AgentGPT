import clsx from "clsx";

type PrimaryButtonProps = {
  children: string;
  onClick?: () => void;
  outline?: boolean;
};
export default function PrimaryButton({ children, onClick, outline }: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        "text-md rounded-lg px-4 py-2.5  shadow-sm ",
        "transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
        outline
          ? "text-[#BF7DFF]/90 ring-1 ring-[#BF7DFF] hover:bg-[#BF7DFF]/20"
          : "bg-[#BF7DFF] text-white hover:border-blue-200 hover:bg-[#9124ff] hover:text-zinc-200 "
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
