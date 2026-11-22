import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuPawPrint, LuCircleUser, LuUser, LuPencil, LuShieldCheck } from "react-icons/lu";
// components
import Button from "../../common/Button/Button.jsx";
// config
import { APP_NAME, APP_SUBTITLE, APP_FOOTER, HOME_PATH } from "../../../config/app.js";
// css
import "./TopBar.css";

// Barra superior. Com `user` mostra o cartão do perfil; sem ele, só o selo (telas de login).
const TopBar = ({ user }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const logged = user !== undefined;

  useEffect(() => {
    if (!open) return;
    const close = (e) => !menuRef.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <header className="topbar">
      <Link to={logged ? HOME_PATH : "/"} className="topbar-brand">
        <span className="topbar-logo">
          <LuPawPrint />
        </span>
        <span>
          <div className="topbar-name">{APP_NAME}</div>
          <div className="topbar-subtitle">{APP_SUBTITLE}</div>
        </span>
      </Link>

      {!logged ? (
        <span className="topbar-icon" aria-hidden="true">
          <LuShieldCheck />
        </span>
      ) : (
        <div className="profile-menu" ref={menuRef}>
          <button
            type="button"
            className="topbar-icon"
            aria-label="Perfil"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            <LuCircleUser />
          </button>

          {open && (
            <div className="profile-pop">
              <div className="profile-pop-head">
                <span className="icon-bubble">
                  <LuUser />
                </span>
                <div>
                  <div className="profile-pop-name">{user?.name ?? "—"}</div>
                  <div className="list-item-text">Administrador(a)</div>
                </div>
              </div>
              <dl>
                <dt>Nome</dt>
                <dd>{user?.name ?? "—"}</dd>
                <dt>E-mail</dt>
                <dd>{user?.email ?? "—"}</dd>
              </dl>
              <Button
                className="btn btn-outline btn-block btn-sm"
                icon={LuPencil}
                buttonText="Editar perfil"
                onClick={() => {
                  setOpen(false);
                  navigate("/perfil");
                }}
              />
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export const Footer = () => <footer className="app-footer">{APP_FOOTER}</footer>;

export default TopBar;
