const express = require('express');
const {
  create,
  list,
  getById,
  patchStatus,
  patchComment
} = require('../controllers/incidentsController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');
const {
  createIncidentValidator,
  listIncidentsValidator,
  incidentIdValidator,
  patchStatusValidator,
  patchCommentValidator
} = require('../validators/incidentValidators');

const router = express.Router();

router.get('/', listIncidentsValidator, validateRequest, list);
router.get('/:id', incidentIdValidator, validateRequest, getById);
router.post('/', authenticate, createIncidentValidator, validateRequest, create);
router.patch('/:id/status', authenticate, requireAdmin, patchStatusValidator, validateRequest, patchStatus);
router.patch('/:id/comment', authenticate, patchCommentValidator, validateRequest, patchComment);

module.exports = router;