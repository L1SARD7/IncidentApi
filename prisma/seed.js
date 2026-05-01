require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { IncidentStatus } = require('../src/constants/incidentStatus');

const prisma = new PrismaClient();

async function seed() {
  const [adminRole, userRole] = await Promise.all([
    prisma.role.upsert({ where: { name: 'admin' }, update: {}, create: { name: 'admin' } }),
    prisma.role.upsert({ where: { name: 'user' }, update: {}, create: { name: 'user' } })
  ]);

  await Promise.all([
    prisma.status.upsert({ where: { name: IncidentStatus.NEW }, update: {}, create: { name: IncidentStatus.NEW } }),
    prisma.status.upsert({ where: { name: IncidentStatus.IN_PROGRESS }, update: {}, create: { name: IncidentStatus.IN_PROGRESS } }),
    prisma.status.upsert({ where: { name: IncidentStatus.RESOLVED }, update: {}, create: { name: IncidentStatus.RESOLVED } })
  ]);

  const [low, medium, high] = await Promise.all([
    prisma.priority.upsert({ where: { name: 'Low' }, update: {}, create: { name: 'Low' } }),
    prisma.priority.upsert({ where: { name: 'Medium' }, update: {}, create: { name: 'Medium' } }),
    prisma.priority.upsert({ where: { name: 'High' }, update: {}, create: { name: 'High' } })
  ]);

  await Promise.all([
    prisma.category.upsert({ where: { name: 'Water Leak' }, update: {}, create: { name: 'Water Leak', priorityId: high.id } }),
    prisma.category.upsert({ where: { name: 'Power Outage' }, update: {}, create: { name: 'Power Outage', priorityId: high.id } }),
    prisma.category.upsert({ where: { name: 'Noise Complaint' }, update: {}, create: { name: 'Noise Complaint', priorityId: low.id } })
  ]);

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@incident.local' },
    update: {},
    create: {
      email: 'admin@incident.local',
      passwordHash: adminPassword,
      firstName: 'System',
      lastName: 'Admin',
      roleId: adminRole.id
    }
  });

  await prisma.admin.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id }
  });

  await prisma.user.upsert({
    where: { email: 'user@incident.local' },
    update: {},
    create: {
      email: 'user@incident.local',
      passwordHash: userPassword,
      firstName: 'Default',
      lastName: 'User',
      roleId: userRole.id
    }
  });

  // --- Pumping stations / pumps demo data ---
  await Promise.all([
    prisma.pumpState.upsert({ where: { id: 1 }, update: { name: 'Працює' }, create: { id: 1, name: 'Працює' } }),
    prisma.pumpState.upsert({ where: { id: 2 }, update: { name: 'Поломка' }, create: { id: 2, name: 'Поломка' } }),
    prisma.pumpState.upsert({ where: { id: 3 }, update: { name: 'Виведена в ремонт' }, create: { id: 3, name: 'Виведена в ремонт' } }),
    prisma.pumpState.upsert({ where: { id: 4 }, update: { name: 'Виведена з експлуатації' }, create: { id: 4, name: 'Виведена з експлуатації' } })
  ]);

  await Promise.all([
    prisma.pumpModel.upsert({ where: { id: 1 }, update: { name: 'Grundfos LS 150-100-315' }, create: { id: 1, name: 'Grundfos LS 150-100-315' } }),
    prisma.pumpModel.upsert({ where: { id: 2 }, update: { name: 'Wilo-Crononorm-NLG 200/315' }, create: { id: 2, name: 'Wilo-Crononorm-NLG 200/315' } }),
    prisma.pumpModel.upsert({ where: { id: 3 }, update: { name: 'Flowserve LNN 250' }, create: { id: 3, name: 'Flowserve LNN 250' } }),
    prisma.pumpModel.upsert({ where: { id: 4 }, update: { name: 'Д 320-50 (КВП)' }, create: { id: 4, name: 'Д 320-50 (КВП)' } })
  ]);

  // SQLite: store location as text "POINT(lon lat)"
  await Promise.all([
    prisma.pumpingStation.upsert({
      where: { id: 1 },
      update: { name: 'Деснянська водопровідна станція (ДВС)', location: 'POINT(30.5694 50.5661)' },
      create: { id: 1, name: 'Деснянська водопровідна станція (ДВС)', location: 'POINT(30.5694 50.5661)' }
    }),
    prisma.pumpingStation.upsert({
      where: { id: 2 },
      update: { name: 'Дніпровська водопровідна станція (ДнВС)', location: 'POINT(30.4851 50.5750)' },
      create: { id: 2, name: 'Дніпровська водопровідна станція (ДнВС)', location: 'POINT(30.4851 50.5750)' }
    }),
    prisma.pumpingStation.upsert({
      where: { id: 3 },
      update: { name: 'Оболонська артезіанська насосна станція (ОАНС)', location: 'POINT(30.4988 50.5211)' },
      create: { id: 3, name: 'Оболонська артезіанська насосна станція (ОАНС)', location: 'POINT(30.4988 50.5211)' }
    }),
    prisma.pumpingStation.upsert({
      where: { id: 4 },
      update: { name: 'Південна насосна станція (Резервна)', location: 'POINT(30.5650 50.3800)' },
      create: { id: 4, name: 'Південна насосна станція (Резервна)', location: 'POINT(30.5650 50.3800)' }
    })
  ]);

  await Promise.all([
    prisma.pump.upsert({ where: { id: 1 }, update: { stationId: 1, name: 'ДВС-Н1 (Підйом 1)', modelId: 4, stateId: 1 }, create: { id: 1, stationId: 1, name: 'ДВС-Н1 (Підйом 1)', modelId: 4, stateId: 1 } }),
    prisma.pump.upsert({ where: { id: 2 }, update: { stationId: 1, name: 'ДВС-Н2 (Підйом 1)', modelId: 4, stateId: 3 }, create: { id: 2, stationId: 1, name: 'ДВС-Н2 (Підйом 1)', modelId: 4, stateId: 3 } }),
    prisma.pump.upsert({ where: { id: 3 }, update: { stationId: 1, name: 'ДВС-Н3 (Додатковий)', modelId: 1, stateId: 1 }, create: { id: 3, stationId: 1, name: 'ДВС-Н3 (Додатковий)', modelId: 1, stateId: 1 } }),
    prisma.pump.upsert({ where: { id: 4 }, update: { stationId: 2, name: 'ДнВС-Магістральний А', modelId: 3, stateId: 1 }, create: { id: 4, stationId: 2, name: 'ДнВС-Магістральний А', modelId: 3, stateId: 1 } }),
    prisma.pump.upsert({ where: { id: 5 }, update: { stationId: 2, name: 'ДнВС-Магістральний Б', modelId: 3, stateId: 2 }, create: { id: 5, stationId: 2, name: 'ДнВС-Магістральний Б', modelId: 3, stateId: 2 } }),
    prisma.pump.upsert({ where: { id: 6 }, update: { stationId: 3, name: 'ОАНС-Свердловина 14', modelId: 2, stateId: 1 }, create: { id: 6, stationId: 3, name: 'ОАНС-Свердловина 14', modelId: 2, stateId: 1 } }),
    prisma.pump.upsert({ where: { id: 7 }, update: { stationId: 3, name: 'ОАНС-Свердловина 15', modelId: 2, stateId: 1 }, create: { id: 7, stationId: 3, name: 'ОАНС-Свердловина 15', modelId: 2, stateId: 1 } }),
    prisma.pump.upsert({ where: { id: 8 }, update: { stationId: 4, name: 'ПВС-Резерв-1', modelId: 4, stateId: 4 }, create: { id: 8, stationId: 4, name: 'ПВС-Резерв-1', modelId: 4, stateId: 4 } })
  ]);
}

module.exports = { seed };

if (require.main === module) {
  seed()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (error) => {
      console.error(error);
      await prisma.$disconnect();
      process.exit(1);
    });
}