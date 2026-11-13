import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";

// services
import { login as apiLogin } from "../../../services/login.js";
import { USE_MOCK } from "../../../services/api.js";
import { MOCK_LOGIN } from "../../../services/mock/seed.js";

// context
import { useAuthValue } from "../../../context/TokenContext.jsx";

// hooks
import { usePageTitle } from "../../../hooks/usePageTitle.js";

// config
import { HOME_PATH } from "../../../config/app.js";

// components
import AuthLayout from "../../../components/Layouts/AuthLayout/AuthLayout.jsx";
import Input, { Checkbox } from "../../../components/common/Inputs/Inputs.jsx";
import Button from "../../../components/common/Button/Button.jsx";
// teste
const Login = () => {
  usePageTitle("Login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);

  const { login, authenticated } = useAuthValue();
  const navigate = useNavigate();

  // já logado: vai direto para o painel
  useEffect(() => {
    if (authenticated) navigate(HOME_PATH, { replace: true });
  }, [authenticated, navigate]);

  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timeout);
  }, [message]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const data = await apiLogin(email, password);
      login(data.id, data.token, remember);
      navigate(HOME_PATH);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error?.message || "Email ou senha inválidos.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestLogin = async () => {
    if (submitting) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const data = await apiLogin(MOCK_LOGIN.email, MOCK_LOGIN.password);
      login(data.id, data.token, remember);
      navigate(HOME_PATH);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error?.message || "Não foi possível entrar.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-header">
        <img src="/logo.png" alt="Mãos e Patas — Clínica Veterinária" />
        <h1>Bem-vindo(a)!</h1>
        <p>Acesse o sistema da clínica</p>
      </div>

      <form onSubmit={handleLogin}>
        <Input
          labelText="E-mail"
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          autoComplete="email"
          required
        />

        <Input
          labelText="Senha"
          type={showPassword ? "text" : "password"}
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
          autoComplete="current-password"
          required
        >
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <LuEyeOff /> : <LuEye />}
          </button>
        </Input>

        <div className="auth-options">
          <Checkbox
            labelText="Lembrar de mim"
            checked={remember}
            onChange={setRemember}
          />
          <NavLink to="/ForgotPassword" className="auth-link">
            Esqueci minha senha
          </NavLink>
        </div>

        {message && (
          <p
            role="alert"
            className={
              message.type === "success" ? "form-success" : "form-error"
            }
          >
            {message.text}
          </p>
        )}

        <Button
          className="btn btn-block"
          type="submit"
          buttonText={submitting ? "Entrando..." : "Entrar"}
          disabled={submitting}
        />

        {USE_MOCK && (
          <Button
            className="btn btn-outline btn-block"
            buttonText="Entrar como teste"
            onClick={handleTestLogin}
            disabled={submitting}
          />
        )}
      </form>
    </AuthLayout>
  );
};

export default Login;
