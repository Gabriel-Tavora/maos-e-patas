import { Suspense } from "react";
import { Outlet } from "react-router-dom";
// Components
import TopBar, { Footer } from "../TopBar/TopBar.jsx";
import Sidebar from "../SideBar/SideBar.jsx";
// hooks
import { useFetch } from "../../../hooks/useFetch.js";
// services
import { getCurrentUser } from "../../../services/userData.js";
// css
import "./AppLayout.css";

// Casca das telas logadas: barra superior + menu + conteúdo da rota + rodapé.
// As páginas leem o usuário com: const { user, setUser } = useOutletContext();
const AppLayout = () => {
  const { data: user, setData: setUser } = useFetch(getCurrentUser);

  return (
    <div className="app-shell">
      <TopBar user={user} />
      <div className="app-body">
        <Sidebar />
        <main className="app-content">
          <div className="app-content-inner">
            <Suspense fallback={<p className="hint">Carregando...</p>}>
              <Outlet context={{ user, setUser }} />
            </Suspense>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
