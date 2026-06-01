const express = require('express');
const router = express.Router();

const {
    obtenerEmpleados,
    obtenerEmpleadoPorId,
    obtenerTiposEmpleado,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado
} = require('../controllers/empleados.controller');

// Importante: esta ruta va antes de /:id
router.get('/tipos', obtenerTiposEmpleado);

router.get('/', obtenerEmpleados);
router.get('/:id', obtenerEmpleadoPorId);
router.post('/', crearEmpleado);
router.put('/:id', actualizarEmpleado);
router.delete('/:id', eliminarEmpleado);

module.exports = router;