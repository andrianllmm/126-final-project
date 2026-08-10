import { Injectable } from '@nestjs/common';
import { pipeline, type FeatureExtractionPipeline } from '@xenova/transformers';

const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';

@Injectable()
export class EmbeddingsService {
  private pipeline: FeatureExtractionPipeline | null = null;
  private loadingPromise: Promise<FeatureExtractionPipeline> | null = null;

  async embedText(text: string): Promise<number[]> {
    const extractor = await this.getPipeline();
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data as Float32Array);
  }

  private getPipeline(): Promise<FeatureExtractionPipeline> {
    if (this.pipeline) return Promise.resolve(this.pipeline);
    if (!this.loadingPromise) {
      this.loadingPromise = pipeline('feature-extraction', EMBEDDING_MODEL).then(
        (loaded) => {
          this.pipeline = loaded;
          return loaded;
        },
      );
    }
    return this.loadingPromise;
  }
}
