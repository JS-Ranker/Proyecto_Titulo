-- Script para crear un veterinario de prueba
INSERT INTO veterinarios (nombre, email, telefono, password, especialidad_id, numero_licencia, activo) 
VALUES ('Dr. Test Veterinario', 'test@vet.com', '123456789', 'test123', 1, 'VET-TEST-001', 1);

-- Verificar que se creó correctamente
SELECT * FROM veterinarios WHERE email = 'test@vet.com';
