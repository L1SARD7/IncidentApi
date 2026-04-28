const prisma = require('../lib/prisma');
const { IncidentStatus, STATUS_FLOW } = require('../constants/incidentStatus');

const createIncident = async ({ title, description, categoryName, address, photoUrl, authorId }) => {
  const category = await prisma.category.findUnique({ where: { name: categoryName } });
  if (!category) {
    throw new Error('Category not found');
  }

  const newStatus = await prisma.status.findUnique({ where: { name: IncidentStatus.NEW } });

  const incident = await prisma.incident.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      location: address.trim(),
      categoryId: category.id,
      statusId: newStatus.id,
      authorId
    }
  });

  if (photoUrl) {
    await prisma.incidentPhoto.create({
      data: {
        incidentId: incident.id,
        fileUrl: photoUrl
      }
    });
  }

  return getIncidentById(incident.id);
};

const listIncidents = async ({ status, category }) => {
  const where = {};

  if (status) {
    const statusRow = await prisma.status.findUnique({ where: { name: status } });
    where.statusId = statusRow ? statusRow.id : -1;
  }

  if (category) {
    const categoryRow = await prisma.category.findUnique({ where: { name: category } });
    where.categoryId = categoryRow ? categoryRow.id : -1;
  }

  return prisma.incident.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true } },
      status: { select: { name: true } },
      author: { select: { id: true, firstName: true, lastName: true, email: true } }
    }
  });
};

const getIncidentById = async (id) => {
  const incident = await prisma.incident.findUnique({
    where: { id: Number(id) },
    include: {
      category: { select: { name: true } },
      status: { select: { name: true } },
      photos: { select: { fileUrl: true, uploadedAt: true } },
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: { select: { id: true, firstName: true, lastName: true } }
        }
      },
      author: { select: { id: true, firstName: true, lastName: true, email: true } }
    }
  });

  if (!incident) {
    throw new Error('Incident not found');
  }

  return incident;
};

const updateIncidentStatus = async (incidentId, newStatusName) => {
  const incident = await prisma.incident.findUnique({
    where: { id: Number(incidentId) },
    include: { status: true }
  });

  if (!incident) {
    throw new Error('Incident not found');
  }

  const newStatus = await prisma.status.findUnique({ where: { name: newStatusName } });
  if (!newStatus) {
    throw new Error('Invalid status');
  }

  const currentIndex = STATUS_FLOW.indexOf(incident.status.name);
  const nextIndex = STATUS_FLOW.indexOf(newStatus.name);
  if (nextIndex !== currentIndex + 1) {
    throw new Error(`Invalid status transition: ${incident.status.name} -> ${newStatus.name}`);
  }

  await prisma.incident.update({
    where: { id: Number(incidentId) },
    data: { statusId: newStatus.id, lastUpdatedAt: new Date() }
  });

  return getIncidentById(incidentId);
};

const addIncidentComment = async (incidentId, authorId, content) => {
  const existingIncident = await prisma.incident.findUnique({ where: { id: Number(incidentId) } });
  if (!existingIncident) {
    throw new Error('Incident not found');
  }

  await prisma.incidentComment.create({
    data: {
      incidentId: Number(incidentId),
      authorId,
      content: content.trim()
    }
  });

  await prisma.incident.update({
    where: { id: Number(incidentId) },
    data: { lastUpdatedAt: new Date() }
  });

  return getIncidentById(incidentId);
};

module.exports = {
  STATUS_FLOW,
  createIncident,
  listIncidents,
  getIncidentById,
  updateIncidentStatus,
  addIncidentComment
};