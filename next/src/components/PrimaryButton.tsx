import clsx from "clsx";

type PrimaryButtonProps = {
  children: string;
  onClick: () => void;
};
export default function PrimaryButton({ children, onClick }: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        "text-md rounded-lg bg-[#BF7DFF] px-4 py-3 text-white shadow-sm ",
        "transition-colors duration-300 hover:border-blue-200 hover:bg-[#9124ff] hover:text-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
