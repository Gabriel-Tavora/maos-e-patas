import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { LuUser } from "react-icons/lu";
// components
import Button from "../../components/common/Button/Button.jsx";
import Input, { Checkbox } from "../../components/common/Inputs/Inputs.jsx";
// context
import { useAuthValue } from "../../context/TokenContext.jsx";
// hooks
import { usePageTitle } from "../../hooks/usePageTitle.js";
// services
import { editUserData } from "../../services/userData.js";
// config
import { HOME_PATH } from "../../config/app.js";
// utils
import { getErrorMessage } from "../../utils/handleApiError.js";
import { Messages } from "../../utils/message.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Profile = () => {
  usePageTitle("Editar perfil");
  const navigate = useNavigate();
  const { user, setUser } = useOutletContext();
  const { token } = useAuthValue();

  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [changePassword, setChangePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // preenche quando o usuário termina de carregar
  useEffect(() => {
    if (user) setForm({ name: user.name ?? "", email: user.email ?? "", role: user.role ?? "" });
  }, [user]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const error =
      (!form.name.trim() && Messages.REQUIRED_FIELDS) ||
      (!EMAIL_REGEX.test(form.email.trim()) && Messages.EMAIL_INVALID) ||
      (changePassword && password.length < 8 && Messages.PASSWORD_SHORT) ||
      (changePassword && password !== confirmPassword && Messages.PASSWORD_MISMATCH);

    if (error) {
      setMessage({ type: "error", text: error });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const updated = await editUserData(
        { ...form, password: changePassword ? password : undefined },
        token
      );
      setUser((prev) => ({ ...prev, ...form, ...updated }));
      setChangePassword(false);
      setPassword("");
      setConfirmPassword("");
      setMessage({ type: "success", text: Messages.EDIT_SUCCESS });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="page-header">
        <div>
          <h1 className="page-title">Editar perfil</h1>
          <p className="page-subtitle">Atualize os dados do administrador da clínica.</p>
        </div>
        <span className="badge badge--success">Administrador</span>
      </div>

      <section className="card stack">
        <div style={{ alignSelf: "center" }}>
          <span className="icon-bubble icon-bubble--lg">
            <LuUser />
          </span>
        </div>

        <Input
          labelText="Nome completo"
          value={form.name}
          onChange={set("name")}
          autoComplete="name"
          required
        />
        <Input
          labelText="E-mail"
          type="email"
          value={form.email}
          onChange={set("email")}
          autoComplete="email"
          required
        />
        <Input labelText="Função" value={form.role} onChange={set("role")} />

        <div className="card-header" style={{ margin: 0 }}>
          <h2 className="card-title">Alterar senha</h2>
          <Checkbox labelText="Alterar" checked={changePassword} onChange={setChangePassword} />
        </div>

        {changePassword && (
          <div className="form-grid">
            <Input
              labelText="Nova senha"
              type="password"
              placeholder="Mínimo de 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <Input
              labelText="Confirme a senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
        )}

        {message && (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={message.type === "success" ? "form-success" : "form-error"}
          >
            {message.text}
          </p>
        )}

        <div className="page-actions" style={{ marginTop: 0 }}>
          <Button
            className="btn btn-outline"
            buttonText="Cancelar"
            onClick={() => navigate(HOME_PATH)}
          />
          <Button
            className="btn"
            type="submit"
            buttonText={saving ? "Salvando..." : "Salvar alterações"}
            disabled={saving || !user}
          />
        </div>
      </section>
    </form>
  );
};

export default Profile;
