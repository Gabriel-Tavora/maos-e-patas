// React
import { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";

// CSS
import "./styles/global.css";
import "./styles/index.css";
import "./components/common/Button/Button.css";

// Router
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Auth
import { AuthProvider } from "./context/TokenContext";
import PrivateRoute from "./context/privateRoutex.jsx";

// Layout
import AppLayout from "./components/Layouts/AppLayout/AppLayout.jsx";

// Lazy Pages
const Login = lazy(() => import("./pages/Auth/Login/Login.jsx"));
const ForgotPassword = lazy(() =>
  import("./pages/Auth/ForgotPassword/ForgotPassword.jsx")
);
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard.jsx"));
const ClientsList = lazy(() => import("./pages/Clients/ClientsList.jsx"));
const ClientNew = lazy(() => import("./pages/Clients/ClientNew.jsx"));
const ClientDetail = lazy(() => import("./pages/Clients/ClientDetail.jsx"));
const AnimalNew = lazy(() => import("./pages/Animals/AnimalNew.jsx"));
const AnimalDetail = lazy(() => import("./pages/Animals/AnimalDetail.jsx"));
const Appointments = lazy(() => import("./pages/Appointments/Appointments.jsx"));
const Profile = lazy(() => import("./pages/Profile/Profile.jsx"));
const NotFound = lazy(() => import("./pages/common/NotFound/NotFound.jsx"));

const router = createBrowserRouter([
  // Públicas
  { path: "/", element: <Login /> },
  { path: "/ForgotPassword", element: <ForgotPassword /> },

  // Logadas: barra superior + menu lateral
  {
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "/painel", element: <Dashboard /> },
      { path: "/clientes", element: <ClientsList /> },
      { path: "/clientes/novo", element: <ClientNew /> },
      { path: "/clientes/:id", element: <ClientDetail /> },
      { path: "/clientes/:id/animais/novo", element: <AnimalNew /> },
      { path: "/clientes/:id/animais/:animalId", element: <AnimalDetail /> },
      { path: "/atendimentos", element: <Appointments /> },
      { path: "/perfil", element: <Profile /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Suspense fallback={<p className="hint">Carregando...</p>}>
      <RouterProvider router={router} />
    </Suspense>
  </AuthProvider>
);
