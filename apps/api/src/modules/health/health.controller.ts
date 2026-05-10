import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthService } from './health.service.js';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthService: HealthService,
  ) {}

  @Get()
  @HealthCheck()
  @AllowAnonymous()
  check() {
    return this.health.check([() => this.healthService.checkApp()]);
  }
}
