import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  checkApp(): HealthIndicatorResult {
    return {
      app: {
        status: 'up',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
