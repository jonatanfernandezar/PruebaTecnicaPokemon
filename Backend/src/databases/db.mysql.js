import { createPool } from "mysql2/promise"; 

// Conexión a la base de datos.
export const pool = createPool({
    user: 'root',
    password: 'root',
    host: 'localhost',
    database: 'crud_prueba_tecnica_pokemon'
});

