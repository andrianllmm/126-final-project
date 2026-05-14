import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller.js';
import { UploadsService } from './uploads.service.js';

import { DatabaseModule } from '../../database/database.module.js';

import { LocalStorageProvider } from './storage/local.storage.js';
import { S3StorageProvider } from './storage/s3.storage.js';

import { StorageProvider } from './storage/storage.interface.js';
import { env } from '../../config/env.js';

const storageProvider: StorageProvider =
  env.uploadDriver === 's3'
    ? new S3StorageProvider()
    : new LocalStorageProvider();

@Module({
  imports: [DatabaseModule],
  controllers: [UploadsController],
  providers: [
    UploadsService,
    {
      provide: 'STORAGE_PROVIDER',
      useValue: storageProvider,
    },
  ],
  exports: [UploadsService],
})
export class UploadsModule {}
