const {
  createIncident,
  listIncidents,
  getIncidentById,
  updateIncidentStatus,
  addIncidentComment
} = require('../services/incidentService');

const create = async (req, res) => {
  try {
    const { title, description, category, address, photo } = req.body;
    const incident = await createIncident({
      title,
      description,
      categoryName: category,
      address,
      photoUrl: photo,
      authorId: req.user.sub
    });

    return res.status(201).json(incident);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const list = async (req, res) => {
  try {
    const { status, category } = req.query;
    const incidents = await listIncidents({ status, category });
    return res.json(incidents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const incident = await getIncidentById(req.params.id);
    return res.json(incident);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const patchStatus = async (req, res) => {
  try {
    const incident = await updateIncidentStatus(req.params.id, req.body.status);
    return res.json(incident);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const patchComment = async (req, res) => {
  try {
    const incident = await addIncidentComment(req.params.id, req.user.sub, req.body.content);
    return res.json(incident);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  create,
  list,
  getById,
  patchStatus,
  patchComment
};