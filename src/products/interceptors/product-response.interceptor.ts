import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Product } from 'src/entities/Product';
import { map } from 'rxjs/operators';
import { ProductPhoto } from 'src/entities/ProductPhoto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductResponseInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    return next.handle().pipe(
      map((p: Product) => {
        return { product: this.transformImageUrl(req, p) };
      }),
    );
  }

  private transformImageUrl(req, p: Product) {
    const baseUrl = `${req.protocol}://${
      req.headers.host
    }/${this.configService.get<string>('basePath')}`;
    (p.mainPhoto as any) = p.mainPhoto && baseUrl + p.mainPhoto;
    return p;
  }
}
