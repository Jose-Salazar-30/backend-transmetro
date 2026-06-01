const pool = require('../config/db');

// Obtener todos los empleados
const obtenerEmpleados = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.id,
                e.nombre,
                e.apellido,
                e.dpi,
                e.telefono,
                e.correo,
                e.direccion,
                e.id_tipo_empleado,
                t.nombre AS tipo_empleado,
                e.estado
            FROM empleados e
            INNER JOIN tipos_empleado t
                ON e.id_tipo_empleado = t.id
            ORDER BY e.id ASC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        res.status(500).json({ mensaje: 'Error al obtener empleados' });
    }
};

// Obtener empleado por ID
const obtenerEmpleadoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                e.id,
                e.nombre,
                e.apellido,
                e.dpi,
                e.telefono,
                e.correo,
                e.direccion,
                e.id_tipo_empleado,
                t.nombre AS tipo_empleado,
                e.estado
            FROM empleados e
            INNER JOIN tipos_empleado t
                ON e.id_tipo_empleado = t.id
            WHERE e.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Empleado no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener empleado:', error);
        res.status(500).json({ mensaje: 'Error al obtener empleado' });
    }
};

// Obtener tipos de empleado
const obtenerTiposEmpleado = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM tipos_empleado
            ORDER BY id ASC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener tipos de empleado:', error);
        res.status(500).json({ mensaje: 'Error al obtener tipos de empleado' });
    }
};

// Crear empleado
const crearEmpleado = async (req, res) => {
    const {
        nombre,
        apellido,
        dpi,
        telefono,
        correo,
        direccion,
        id_tipo_empleado,
        estado
    } = req.body;

    try {
        if (!nombre || !apellido || !dpi || !id_tipo_empleado) {
            return res.status(400).json({
                mensaje: 'Los campos nombre, apellido, dpi e id_tipo_empleado son obligatorios'
            });
        }

        const result = await pool.query(`
            INSERT INTO empleados (
                nombre,
                apellido,
                dpi,
                telefono,
                correo,
                direccion,
                id_tipo_empleado,
                estado
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [
            nombre,
            apellido,
            dpi,
            telefono,
            correo,
            direccion,
            id_tipo_empleado,
            estado || 'Activo'
        ]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear empleado:', error);

        if (error.code === '23505') {
            return res.status(400).json({
                mensaje: 'Ya existe un empleado con ese DPI'
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                mensaje: 'El tipo de empleado no existe'
            });
        }

        res.status(500).json({ mensaje: 'Error al crear empleado' });
    }
};

// Actualizar empleado
const actualizarEmpleado = async (req, res) => {
    const { id } = req.params;

    const {
        nombre,
        apellido,
        dpi,
        telefono,
        correo,
        direccion,
        id_tipo_empleado,
        estado
    } = req.body;

    try {
        if (!nombre || !apellido || !dpi || !id_tipo_empleado) {
            return res.status(400).json({
                mensaje: 'Los campos nombre, apellido, dpi e id_tipo_empleado son obligatorios'
            });
        }

        const result = await pool.query(`
            UPDATE empleados
            SET 
                nombre = $1,
                apellido = $2,
                dpi = $3,
                telefono = $4,
                correo = $5,
                direccion = $6,
                id_tipo_empleado = $7,
                estado = $8
            WHERE id = $9
            RETURNING *
        `, [
            nombre,
            apellido,
            dpi,
            telefono,
            correo,
            direccion,
            id_tipo_empleado,
            estado || 'Activo',
            id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Empleado no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar empleado:', error);

        if (error.code === '23505') {
            return res.status(400).json({
                mensaje: 'Ya existe un empleado con ese DPI'
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                mensaje: 'El tipo de empleado no existe'
            });
        }

        res.status(500).json({ mensaje: 'Error al actualizar empleado' });
    }
};

// Eliminar empleado
const eliminarEmpleado = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            DELETE FROM empleados
            WHERE id = $1
            RETURNING *
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Empleado no encontrado' });
        }

        res.json({ mensaje: 'Empleado eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        res.status(500).json({ mensaje: 'Error al eliminar empleado' });
    }
};

module.exports = {
    obtenerEmpleados,
    obtenerEmpleadoPorId,
    obtenerTiposEmpleado,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado
};