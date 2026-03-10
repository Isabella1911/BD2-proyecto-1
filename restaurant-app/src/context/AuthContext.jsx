// =====================================================
// Context: Autenticación
// Archivo nuevo: src/context/AuthContext.jsx
// Provee currentUser a toda la app
// =====================================================

import { createContext, useContext, useState } from "react";
import { API_URL } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginError, setLoginError]   = useState("");
  const [isLoading, setIsLoading]     = useState(false);

  const login = async (email) => {
    setIsLoading(true);
    setLoginError("");
    try {
      const res = await fetch(`${API_URL}/usuarios/email/${encodeURIComponent(email)}`);
      if (!res.ok) {
        setLoginError("No se encontró ningún usuario con ese email.");
        return false;
      }
      const user = await res.json();
      // user._id es el ID real de MongoDB ("user001", etc.)
      setCurrentUser({
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        direccion: user.direccion || "",
        telefono: user.telefono || "",
      });
      return true;
    } catch (err) {
      setLoginError("Error al conectar con el servidor.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loginError, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}