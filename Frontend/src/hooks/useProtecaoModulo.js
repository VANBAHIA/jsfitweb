import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';  // ✅ Caminho correto

export const useProtecaoModulo = (perfisPermitidos = []) => {
  const [autorizado, setAutorizado] = useState(false);
  const { usuario } = useContext(AuthContext);

 useEffect(() => {
  if (usuario && usuario.perfil && perfisPermitidos.includes(usuario.perfil)) {
    setAutorizado(true);
  } else {
    setAutorizado(false);
  }
}, [usuario, perfisPermitidos]);

  return { autorizado };
};