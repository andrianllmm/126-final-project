import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { User } from '../../generated/prisma/client.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
