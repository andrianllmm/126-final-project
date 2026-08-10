import { Module } from '@nestjs/common';

import { ListingsController } from './listings.controller.js';
import { ListingsService } from './listings.service.js';
import { ListingImagesController } from './listing-images.controller.js';
import { ListingImagesService } from './listing-images.service.js';
import { ListingPolicy } from './listing.policy.js';
import { SearchModule } from './search.module.js';
import { UploadsModule } from '../uploads/uploads.module.js';
import { EmbeddingsModule } from '../embeddings/embeddings.module.js';

@Module({
  imports: [UploadsModule, SearchModule, EmbeddingsModule],
  controllers: [ListingsController, ListingImagesController],
  providers: [ListingsService, ListingImagesService, ListingPolicy],
})
export class ListingsModule {}
