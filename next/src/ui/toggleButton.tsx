import React from "react";

type ToggleButtonProps = {
  className?: string;
  setChecked: (checked: boolean) => void;
  onIcon: React.ReactNode;
  offIcon: React.ReactNode;
  checked: boolean;
};

const ToggleButton = ({ ...props }: ToggleButtonProps) => {
  const handleClick = () => {
    props.setChecked(!props.checked);
  };

  const icon = props.checked ? props.onIcon : props.offIcon;
  return (
    <button type="button" className={props.className} onClick={handleClick}>
      {icon}
    </button>
  );
};

export default ToggleButton;
