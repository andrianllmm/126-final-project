import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getIndex() {
    return {
      name: 'Iskommerce API',
      version: '1.0.0',
      status: 'running',
      docs: '/docs',
    };
  }
}
