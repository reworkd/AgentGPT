import React, {useState} from 'react';

type ConnectSidButtonProps = {
  isConnected: boolean;
  width: number;
  fontScale: number;
  height: number;
  onDisconnect: () => void;
  href: string;
}

type sidSVGProps = {
  width: number | undefined;
  height: number | undefined;
  fill: string;
}

function SidSVG({width, height, fill}: sidSVGProps) {
  return <svg width={width} height={height} viewBox="0 0 220 94" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M71.0015 31.2C67.9295 29.408 64.5588 27.744 60.8895 26.208C57.2202 24.672 53.6362 23.4347 50.1375 22.496C46.7242 21.5573 43.7375 21.088 41.1775 21.088C38.9588 21.088 37.1668 21.5147 35.8015 22.368C34.4362 23.2213 33.7535 24.544 33.7535 26.336C33.7535 28.2987 34.5642 29.92 36.1855 31.2C37.8922 32.3947 40.1535 33.4187 42.9695 34.272C45.7855 35.1253 48.8575 36.0213 52.1855 36.96C55.5135 37.8133 58.8415 38.9227 62.1695 40.288C65.4975 41.568 68.5268 43.232 71.2575 45.28C74.0735 47.2427 76.3348 49.8453 78.0415 53.088C79.7482 56.2453 80.6015 60.1707 80.6015 64.864C80.6015 71.3493 78.8948 76.7253 75.4815 80.992C72.1535 85.1733 67.6735 88.3307 62.0415 90.464C56.4948 92.512 50.3508 93.536 43.6095 93.536C38.4895 93.536 33.3268 92.9387 28.1215 91.744C22.9162 90.5493 17.9242 88.8853 13.1455 86.752C8.45217 84.6187 4.22817 82.016 0.4735 78.944L10.4575 58.72C13.5295 61.3653 17.0708 63.7547 21.0815 65.888C25.1775 67.936 29.2308 69.6 33.2415 70.88C37.3375 72.0747 40.8788 72.672 43.8655 72.672C46.7668 72.672 49.0282 72.16 50.6495 71.136C52.2708 70.0267 53.0815 68.4053 53.0815 66.272C53.0815 64.3093 52.2282 62.7307 50.5215 61.536C48.8148 60.256 46.5535 59.1893 43.7375 58.336C41.0068 57.4827 37.9348 56.6293 34.5215 55.776C31.1935 54.9227 27.8655 53.8987 24.5375 52.704C21.2948 51.424 18.2655 49.8027 15.4495 47.84C12.6335 45.8773 10.3722 43.36 8.6655 40.288C7.04417 37.216 6.2335 33.376 6.2335 28.768C6.2335 22.9653 7.7695 17.9307 10.8415 13.664C13.9135 9.31199 18.2228 5.98399 23.7695 3.67999C29.3162 1.376 35.8442 0.223999 43.3535 0.223999C50.1802 0.223999 56.9215 1.20533 63.5775 3.168C70.2335 5.04533 75.9935 7.56266 80.8575 10.72L71.0015 31.2ZM90.3645 2.272H116.989V92H90.3645V2.272ZM171.411 2.272C178.749 2.272 185.363 3.33866 191.251 5.47199C197.139 7.60533 202.173 10.6347 206.355 14.56C210.621 18.4853 213.907 23.2213 216.211 28.768C218.515 34.2293 219.667 40.3307 219.667 47.072C219.667 53.8133 218.515 59.9573 216.211 65.504C213.907 70.9653 210.579 75.7013 206.227 79.712C201.875 83.6373 196.669 86.6667 190.611 88.8C184.637 90.9333 177.939 92 170.515 92H132.115V2.272H171.411ZM172.179 71.136C175.251 71.136 177.981 70.5813 180.371 69.472C182.845 68.2773 184.979 66.656 186.771 64.608C188.648 62.4747 190.056 59.9573 190.995 57.056C192.019 54.1547 192.531 50.912 192.531 47.328C192.531 43.744 192.019 40.5013 190.995 37.6C189.971 34.6133 188.477 32.0533 186.515 29.92C184.637 27.7013 182.376 26.0373 179.731 24.928C177.085 23.8187 174.141 23.264 170.899 23.264H158.739V71.136H172.179Z"
      fill={fill}/>
  </svg>;
}

const ConnectSidButton: React.FC<ConnectSidButtonProps> = ({width, height, fontScale, isConnected, onDisconnect, href}) => {
  const handleDisconnectClick = async () => {
    // Add your code here to handle the disconnect SID
    onDisconnect();
    console.log('Disconnect button clicked');
  };

  const buttonWidth = `${width}px`;
  const buttonHeight = `${height}px`;
  const svgSize = 25*fontScale;
  const manageURL = "https://me.sid.ai/";


  const [isHoveredLeft, setIsHoveredLeft] = useState(false);
  const [isHoveredRight, setIsHoveredRight] = useState(false);
  const [isHovered, setIsHovered] = useState(false);


  if (isConnected) {
    //Manage SID / Disconnect SID state
    const leftButtonText = "Manage";
    const rightButtonText = "Disconnect";

    const target = "_blank";
    const styles = {
      dualButton: {
        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
        borderRadius: "10px",
        display: "flex",
        width: buttonWidth,
        height: buttonHeight,
        overflow: "hidden",
      },
      leftButton: {
        boxShadow: isHoveredLeft ? "inset 0 0 0 150px rgba(12, 12, 12, 0.1)" : "none",
        transition: "0.3s ease 0s",
        textDecoration: "none",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: `${(16*fontScale).toFixed(2)}px`,
        cursor: "pointer",
        display: "flex",
        gap: `${(5*fontScale).toFixed(2)}px`,
        backgroundColor: "#F4E7D4",
        color: "#0C0C0C",
        alignItems: "center",
        justifyContent: "center",
        fontStyle: "normal",
        fontWeight: 500,
        flex: 1,
        padding: 0,
        height: buttonHeight,
      },
      rightButton: {
        boxShadow: isHoveredRight ? "inset 0 0 0 150px rgba(244,231,212, 0.1)" : "none",
        transition: "0.3s ease 0s",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: `${(16*fontScale).toFixed(2)}px`,
        cursor: "pointer",
        display: "flex",
        gap: `${(5*fontScale).toFixed(2)}px`,
        backgroundColor: "#0C0C0C",
        color: "#F4E7D4",
        border: "none",
        alignItems: "center",
        justifyContent: "center",
        fontStyle: "normal",
        fontWeight: 500,
        flex: 1,
        padding: 0,
        height: buttonHeight,
      }
    }
    return (
      <div style={styles.dualButton}>
        <a href={manageURL}
           target={target}
           style={styles.leftButton}
           onMouseEnter={() => setIsHoveredLeft(true)}
           onMouseLeave={() => setIsHoveredLeft(false)}
        >
          <span>{leftButtonText}</span>
          <SidSVG fill={'#0C0C0C'} height={svgSize} width={svgSize}/>
        </a>
        <button style={styles.rightButton}
                onMouseEnter={() => setIsHoveredRight(true)}
                onMouseLeave={() => setIsHoveredRight(false)}
                onClick={handleDisconnectClick}
        >
          <span>{rightButtonText}</span>
          <SidSVG fill={'#F4E7D4'} height={svgSize} width={svgSize}/>
        </button>
      </div>

    );
  } else {
    //continue with SID state
    const buttonText = "Continue with";
    const target = "_self";
    const styles = {
      button: {
        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
        boxShadow: isHovered ? "inset 0 0 0 150px rgba(244,231,212, 0.15)" : "none",
        transition: "0.3s ease 0s",
        borderRadius: "10px",
        backgroundColor: "#0C0C0C",
        color: "#F4E7D4",
        cursor: "pointer",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: `${(16*fontScale).toFixed(2)}px`,
        fontStyle: "normal",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: `${(5*fontScale).toFixed(2)}px`,
        width: buttonWidth,
        height: buttonHeight,
        textDecoration: "none",
        overflow: "hidden",
      }
    }
    return (
      <a href={href}
         target={target}
         style={styles.button}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
      >
        <span>{buttonText}</span>
        <SidSVG fill={'#F4E7D4'} height={svgSize} width={svgSize}/>
      </a>
    );
  }
}

export default ConnectSidButton;
