import 'jest';
import 'express';
import { connectPrisma, disconnectPrisma } from '../src/utils/prisma';

beforeAll(async () => {
  await connectPrisma();
});

afterAll(async () => {
  await disconnectPrisma();
}); 