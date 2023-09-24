import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProductPhoto } from 'src/entities/ProductPhoto';
import { map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PhotoResponseInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((p: ProductPhoto) => {
        return {photo: this.transformImageUrl(req, p)};
      })
    );
  }

  private transformImageUrl(req, p: ProductPhoto) {
    const baseUrl = `${req.protocol}://${
      req.headers.host
    }/${this.configService.get<string>('basePath')}`;
    p.url = p.url && baseUrl + p.url;
    return p;
  }
}
