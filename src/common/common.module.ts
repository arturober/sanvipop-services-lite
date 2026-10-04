import { Module } from '@nestjs/common';
import { ImageService } from './services/image/image.service.js';

@Module({
  providers: [ImageService],
  exports: [ImageService],
})
export class CommonModule {}
