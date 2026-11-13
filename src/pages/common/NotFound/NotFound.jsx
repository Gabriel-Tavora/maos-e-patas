import { Link } from "react-router-dom";
import { usePageTitle } from "../../../hooks/usePageTitle.js";
import AuthLayout from "../../../components/Layouts/AuthLayout/AuthLayout.jsx";

const NotFound = () => {
  usePageTitle("Página não encontrada");

  return (
    <AuthLayout>
      <div className="auth-header" style={{ borderBottom: 0, paddingBottom: 0 }}>
        <h1>Página não encontrada</h1>
        <p>O endereço acessado não existe neste sistema.</p>
      </div>
      <Link to="/" className="btn btn-block">
        Voltar ao início
      </Link>
    </AuthLayout>
  );
};

export default NotFound;
