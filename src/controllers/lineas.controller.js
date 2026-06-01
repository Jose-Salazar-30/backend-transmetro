const pool = require('../config/db');

const obtenerLineas = async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM lineas ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener las líneas',
            error: error.message
        });
    }
};

const obtenerLineasId = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM lineas WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Línea no encontrada'
            });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Erorr al obtener la línea',
            error: error.message
        });
    }
};

const crearLinea = async (req, res) => {
    try {
        const { nombre, color, origen, destino, estado } = req.body;

        const result = await pool.query(
            `INSERT INTO lineas (nombre, color, origen, destino, estado)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
             [nombre, color, origen, destino, estado]
        );

        res.status(201).json({
            mensaje: 'Linea creada correctamente',
            linea: result.rows[0]
        });
    } catch(error) {
        res.status(500).json({
            mensaje: 'Error al crear la línea',
            error: error.message
        });
    }
};

const actualizarLinea = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, color, origen, destino, estado } = req.body;

        const result = await pool.query(
            `UPDATE lineas
             SET nombre = $1,
                 color = $2,
                 origen = $3,
                 destino = $4,
                 estado = $5
             WHERE id = $6
             RETURNING *`,
            [nombre, color, origen, destino, estado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Linea no encontrada'
            });
        }

        res.json({
            mensaje: 'Linea actualizada correctamente',
            linea: result.rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar linea:', error);

        res.status(500).json({
            mensaje: 'Error al actualizar la linea',
            error: error.message
        });
    }
};

const eliminarLinea = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM lineas WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Linea no encontrada'
            });
        }

        res.json({
            mensaje: 'Linea eliminada correctamente',
            linea: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar la línea',
            error: error.message
        });
    }
};

module.exports = {
    obtenerLineas,
    obtenerLineasId,
    crearLinea,
    actualizarLinea,
    eliminarLinea
}