import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { LuLock, LuArrowLeft, LuEye, LuEyeOff } from "react-icons/lu";

// Hook
import { usePasswordReset } from "../../../hooks/usePasswordReset";
import { usePageTitle } from "../../../hooks/usePageTitle.js";

// services
import { USE_MOCK } from "../../../services/api.js";
import { MOCK_RESET_CODE } from "../../../services/mock/seed.js";

//components
import AuthLayout from "../../../components/Layouts/AuthLayout/AuthLayout.jsx";
import Input from "../../../components/common/Inputs/Inputs.jsx";
import Button from "../../../components/common/Button/Button.jsx";

const STEPS = {
  EMAIL: "email",
  PASSWORD: "password",
};

const FormMessage = ({ message }) =>
  message ? (
    <p
      role="status"
      aria-live="polite"
      className={message.type === "success" ? "form-success" : "form-error"}
    >
      {message.text}
    </p>
  ) : null;

const ForgotPassword = () => {
  usePageTitle("Recuperar senha");
  const navigate = useNavigate();

  const [step, setStep] = useState(STEPS.EMAIL);
  const [showPassword, setShowPassword] = useState(false);

  const {
    email,
    setEmail,
    code,
    setCode,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    message,
    sendCode,
    submitPassword,
    cleanup,
  } = usePasswordReset({
    maxAttempts: 4,
    onSuccess: () => navigate("/"),
  });

  useEffect(() => cleanup, [cleanup]);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (loading) return;

    const result = await sendCode(email);
    if (result?.success) setStep(STEPS.PASSWORD);
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (loading) return;

    const result = await submitPassword(code, password);
    if (result?.reason === "max_attempts") setStep(STEPS.EMAIL);
  };

  const passwordType = showPassword ? "text" : "password";

  return (
    <AuthLayout>
      <div className="auth-header">
        <span className="icon-bubble icon-bubble--square icon-bubble--lg">
          <LuLock />
        </span>
        <h1>{step === STEPS.EMAIL ? "Esqueceu sua senha?" : "Redefinir senha"}</h1>
        <p>
          {step === STEPS.EMAIL
            ? "Não se preocupe! Vamos ajudar você a recuperar seu acesso."
            : "Insira o código recebido por e-mail e defina sua nova senha."}
        </p>
      </div>

      {step === STEPS.EMAIL && (
        <form onSubmit={handleSendEmail}>
          <Input
            labelText="E-mail cadastrado"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            autoComplete="email"
          />
          <p className="hint">
            Enviaremos as instruções de recuperação para o endereço informado.
          </p>
          <FormMessage message={message} />
          <Button
            className="btn btn-block"
            type="submit"
            disabled={loading}
            buttonText={loading ? "Enviando..." : "Enviar instruções"}
          />
        </form>
      )}

      {step === STEPS.PASSWORD && (
        <form onSubmit={handleSubmitPassword}>
          <Input
            labelText="Código"
            placeholder="Código enviado ao e-mail"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
            required
            autoComplete="one-time-code"
          />
          {USE_MOCK && (
            <p className="hint">Modo demonstração — use o código {MOCK_RESET_CODE}.</p>
          )}

          <Input
            labelText="Nova senha"
            type={passwordType}
            placeholder="Mínimo de 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            minLength={8}
            autoComplete="new-password"
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

          <Input
            labelText="Confirme a senha"
            type={passwordType}
            placeholder="Repita a nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
            minLength={8}
            autoComplete="new-password"
          />

          <FormMessage message={message} />
          <Button
            className="btn btn-block"
            type="submit"
            disabled={loading}
            buttonText={loading ? "Alterando..." : "Confirmar senha"}
          />
        </form>
      )}

      <NavLink to="/" className="auth-link">
        <LuArrowLeft /> Voltar para o login
      </NavLink>
    </AuthLayout>
  );
};

export default ForgotPassword;
