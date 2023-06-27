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
        "text-md rounded-full border border-blue-300 bg-blue-500/40 px-4 py-2 font-semibold text-blue-300 shadow-sm ",
        "transition-colors duration-300 hover:border-blue-200 hover:text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
