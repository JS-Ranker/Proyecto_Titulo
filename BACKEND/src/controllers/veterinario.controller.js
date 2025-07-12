import Veterinario from '../models/veterinario.model.js';
import bcrypt from 'bcrypt';

export const traerVeterinariosPorEspecialidad = (req, res) => {
  const { especialidad_id } = req.params;
  Veterinario.traerPorEspecialidad(especialidad_id, (err, vets) => {
    if (err) return res.status(500).json({ error: 'Error al obtener veterinarios', detalle: err });
    res.json(vets);
  });
};

// Login de veterinario
export const loginVeterinario = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  Veterinario.loginVeterinario(email, async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor', detalle: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const veterinario = results[0];

    try {
      // Comparar la contraseña (asumiendo que las contraseñas en la BD no están hasheadas actualmente)
      // Si las contraseñas estuvieran hasheadas, usarías: await bcrypt.compare(password, veterinario.password)
      if (password !== veterinario.password) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }

      // No enviar la contraseña en la respuesta
      const { password: _, ...veterinarioSinPassword } = veterinario;
      
      res.json({
        message: 'Login exitoso',
        data: veterinarioSinPassword
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al verificar contraseña', detalle: error });
    }
  });
};

// Obtener todos los veterinarios
export const obtenerVeterinarios = (req, res) => {
  Veterinario.obtenerTodos((err, veterinarios) => {
    if (err) return res.status(500).json({ error: 'Error al obtener veterinarios', detalle: err });
    res.json(veterinarios);
  });
};

// Obtener veterinario por ID
export const obtenerVeterinarioPorId = (req, res) => {
  const { id } = req.params;
  Veterinario.obtenerPorId(id, (err, veterinario) => {
    if (err) return res.status(500).json({ error: 'Error al obtener veterinario', detalle: err });
    if (veterinario.length === 0) {
      return res.status(404).json({ error: 'Veterinario no encontrado' });
    }
    res.json(veterinario[0]);
  });
};

// Crear nuevo veterinario
export const crearVeterinario = (req, res) => {
  const { nombre, email, telefono, password, especialidad_id, numero_licencia } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
  }

  // Verificar si el email ya existe
  Veterinario.verificarEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al verificar email', detalle: err });
    
    if (results.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const veterinarioData = {
      nombre,
      email,
      telefono,
      password, // En producción, deberías hashear la contraseña
      especialidad_id,
      numero_licencia
    };

    Veterinario.crear(veterinarioData, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear veterinario', detalle: err });
      res.status(201).json({ 
        message: 'Veterinario creado exitosamente', 
        id: result.insertId 
      });
    });
  });
};

// Actualizar veterinario
export const actualizarVeterinario = (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono, especialidad_id, numero_licencia } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
  }

  const veterinarioData = {
    nombre,
    email,
    telefono,
    especialidad_id,
    numero_licencia
  };

  Veterinario.actualizar(id, veterinarioData, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar veterinario', detalle: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Veterinario no encontrado' });
    }
    res.json({ message: 'Veterinario actualizado exitosamente' });
  });
};

// Obtener perfil completo del veterinario
export const obtenerPerfilCompleto = (req, res) => {
  const { id } = req.params;
  Veterinario.obtenerPerfilCompleto(id, (err, veterinario) => {
    if (err) return res.status(500).json({ error: 'Error al obtener perfil del veterinario', detalle: err });
    if (veterinario.length === 0) {
      return res.status(404).json({ error: 'Veterinario no encontrado' });
    }
    res.json(veterinario[0]);
  });
};

// Actualizar perfil del veterinario (solo campos editables)
export const actualizarPerfil = (req, res) => {
  const { id } = req.params;
  const { email, telefono } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El email es requerido' });
  }

  // Verificar si el nuevo email ya existe (excluyendo el veterinario actual)
  Veterinario.verificarEmailExistente(email, id, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al verificar email', detalle: err });
    
    if (results.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado por otro veterinario' });
    }

    const veterinarioData = { email, telefono };

    Veterinario.actualizarPerfil(id, veterinarioData, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar perfil', detalle: err });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Veterinario no encontrado' });
      }
      res.json({ message: 'Perfil actualizado exitosamente' });
    });
  });
};

// Actualizar contraseña del veterinario
export const actualizarPassword = async (req, res) => {
  const { id } = req.params;
  const { passwordActual, nuevaPassword } = req.body;

  if (!passwordActual || !nuevaPassword) {
    return res.status(400).json({ error: 'Contraseña actual y nueva contraseña son requeridas' });
  }

  // Buscar el veterinario para verificar la contraseña actual
  Veterinario.obtenerPerfilCompleto(id, async (err, veterinarioResults) => {
    if (err) return res.status(500).json({ error: 'Error al obtener veterinario', detalle: err });
    if (veterinarioResults.length === 0) {
      return res.status(404).json({ error: 'Veterinario no encontrado' });
    }

    const veterinario = veterinarioResults[0];

    try {
      // Verificar contraseña actual (asumiendo que no están hasheadas)
      if (passwordActual !== veterinario.password) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
      }

      // En producción, deberías hashear la nueva contraseña
      // const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
      
      Veterinario.actualizarPassword(id, nuevaPassword, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar contraseña', detalle: err });
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Veterinario no encontrado' });
        }
        res.json({ message: 'Contraseña actualizada exitosamente' });
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al verificar contraseña', detalle: error });
    }
  });
};

// Eliminar (desactivar) veterinario
export const eliminarVeterinario = (req, res) => {
  const { id } = req.params;

  Veterinario.eliminar(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar veterinario', detalle: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Veterinario no encontrado' });
    }
    res.json({ message: 'Veterinario eliminado exitosamente' });
  });
};