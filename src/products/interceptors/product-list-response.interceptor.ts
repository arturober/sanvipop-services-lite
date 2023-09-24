import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/entities/Product';

@Injectable()
export class ProductListResponseInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    return next.handle().pipe(
      map((products: Product[]) => {
        return {
          products: products.map((p) => this.transformImageUrl(req, p)),
        };
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
