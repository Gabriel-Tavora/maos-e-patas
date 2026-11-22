import TopBar, { Footer } from "../TopBar/TopBar.jsx";
import "./AuthLayout.css";

// Casca das telas públicas (login e recuperação de senha)
const AuthLayout = ({ children }) => (
  <div className="auth-page">
    <TopBar />
    <main className="auth-main">
      <section className="auth-card">{children}</section>
    </main>
    <Footer />
  </div>
);

export default AuthLayout;
