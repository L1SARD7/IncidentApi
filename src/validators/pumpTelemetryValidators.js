const { body } = require('express-validator');

const requiredNumber = (field) =>
  body(field)
    .exists({ checkNull: true })
    .withMessage(`${field} is required`)
    .isFloat()
    .withMessage(`${field} must be a number`)
    .toFloat();

const createPumpTelemetryValidator = [
  body('pump_id')
    .exists({ checkNull: true })
    .withMessage('pump_id is required')
    .isInt({ min: 1 })
    .withMessage('pump_id must be a positive integer')
    .toInt(),

  body('time')
    .exists({ checkNull: true })
    .withMessage('time is required')
    .isISO8601({ strict: true })
    .withMessage('time must be valid ISO 8601 datetime'),

  requiredNumber('voltage_v'),
  requiredNumber('current_a'),
  requiredNumber('vibration_rms'),
  requiredNumber('temperature_c'),
  requiredNumber('pressure_in'),
  requiredNumber('pressure_out')
];

module.exports = { createPumpTelemetryValidator };

