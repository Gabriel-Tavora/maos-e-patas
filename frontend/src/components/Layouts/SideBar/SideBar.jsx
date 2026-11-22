//react
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
//CSS
import "./SideBar.css";
//context
import { useAuthValue } from "../../../context/TokenContext.jsx";
//config
import { MENU_ITEMS } from "../../../config/app.js";
//components
import { ConfirmDialog } from "../../common/Modal/Modal.jsx";

const linkClass = ({ isActive }) =>
  isActive ? "menu-link-list-on" : "menu-link-list-off";

function Sidebar() {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthValue();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-label">Menu principal</div>

      <ul className="menu">
        {MENU_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink to={to} className={linkClass}>
              <Icon />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="leave">
        <button type="button" onClick={() => setConfirmLogout(true)} className="menu-link">
          <LuLogOut />
          <span>Sair</span>
        </button>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        title="Tem certeza que deseja sair?"
        confirmText="Sair"
        onConfirm={handleLogout}
        onClose={() => setConfirmLogout(false)}
      />
    </aside>
  );
}

export default Sidebar;
