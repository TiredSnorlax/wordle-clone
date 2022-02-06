import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/menu.css"


const Menu = () => {
    const [selected, setSelected] = useState(null);

    const navigate = useNavigate();


    useEffect(() => {
        if (selected) {
            document.querySelector("body").style.overflow = "hidden";
            document.querySelector(".App").style.overflow = "hidden";
            setTimeout(() => {
                navigate(`/${selected}`);
                document.querySelector("body").style.overflowY = "auto";
                document.querySelector(".App").style.overflowY = "auto";
            }, 600);
        }

    }, [selected]);


  return <div className="content-container">
      <div className="menu-level-container">
        <div className={`menu-level ${selected == 4 ? "selected" : ""}`} onClick={(e) => setSelected(4)}>4 letters</div>
        <div className={`menu-level ${selected == 5 ? "selected" : ""}`} onClick={(e) => setSelected(5)}>5 letters</div>
        <div className={`menu-level ${selected == 6 ? "selected" : ""}`} onClick={(e) => setSelected(6)}>6 letters</div>
        <div className={`menu-level ${selected == 7 ? "selected" : ""}`} onClick={(e) => setSelected(7)}>7 letters</div>
        <div className={`menu-level ${selected == 8 ? "selected" : ""}`} onClick={(e) => setSelected(8)}>8 letters</div>
      </div>
  </div>;
};

export default Menu;
