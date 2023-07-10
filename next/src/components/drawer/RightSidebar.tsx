import type { DisplayProps } from "./Sidebar";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";

const RightSidebar = ({ show, setShow }: DisplayProps) => {
  return (
    <Sidebar show={show} setShow={setShow} side="right">
      <div className="text-white">
        <div className="flex flex-row items-center gap-1">
          <button
            className="neutral-button-primary rounded-md border-none transition-all"
            onClick={() => setShow(!show)}
          >
            <FaBars size="15" className="z-20 m-2" />
          </button>
          <div>Sidebar</div>
        </div>
      </div>
    </Sidebar>
  );
};

export default RightSidebar;
