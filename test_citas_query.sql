-- Script de prueba para verificar la consulta de citas del veterinario

-- 1. Verificar que las tablas existen
SHOW TABLES LIKE 'citas';
SHOW TABLES LIKE 'mascotas'; 
SHOW TABLES LIKE 'duenos';
SHOW TABLES LIKE 'especies';
SHOW TABLES LIKE 'razas';
SHOW TABLES LIKE 'tipos_consulta';

-- 2. Verificar estructura de la tabla citas
DESCRIBE citas;

-- 3. Verificar estructura de la tabla mascotas  
DESCRIBE mascotas;

-- 4. Verificar estructura de la tabla duenos
DESCRIBE duenos;

-- 5. Ver si hay citas para el veterinario ID 7
SELECT * FROM citas WHERE veterinario_id = 7;

-- 6. Probar la consulta completa
SELECT 
  c.id,
  c.mascota_id,
  c.veterinario_id,
  c.fecha_hora,
  c.motivo,
  c.estado,
  m.nombre_mascota,
  m.id_especie,
  m.id_raza,
  d.rut AS dueno_rut,
  d.nombre AS dueno_nombre,
  e.nombre AS especie_nombre,
  r.nombre AS raza_nombre
FROM citas c
LEFT JOIN mascotas m ON c.mascota_id = m.id_mascota
LEFT JOIN duenos d ON m.id_dueno = d.rut
LEFT JOIN tipos_consulta tc ON c.tipo_consulta_id = tc.id
LEFT JOIN especies e ON m.id_especie = e.id
LEFT JOIN razas r ON m.id_raza = r.id
WHERE c.veterinario_id = 7
ORDER BY c.fecha_hora ASC
LIMIT 5;
