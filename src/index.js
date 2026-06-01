const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');
const lineasRoutes = require('./routes/lineas.routes');
const estacionesRoutes = require('./routes/estaciones.routes');
const unidadesRoutes = require('./routes/unidades.routes');
const empleadosRoutes = require('./routes/empleados.routes');
const asignacionesRoutes = require('./routes/asignaciones.routes')
const tarjetasRoutes = require('./routes/tarjetas.routes')

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend de Transmetro funcionando');
});

app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.json({
            mensaje: 'Conexion a PostGres correcta',
            fecha: result.rows[0].now
        });
    } catch (error) {
        console.error('Error al conectar con Postgres', error);

        res.status(500).json({
            mensaje: 'Error al contecta con Postgres',
            error: error.mensaje
        });
    }
});

app.use('/api/lineas', lineasRoutes)
app.use('/api/estaciones', estacionesRoutes)
app.use('/api/unidades', unidadesRoutes)
app.use('/api/empleados', empleadosRoutes)
app.use('/api/asignaciones', asignacionesRoutes)
app.use('/api/tarjetas', tarjetasRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})