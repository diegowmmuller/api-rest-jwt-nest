import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const date = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.log(`(Log do interceptor) - Execução levou: ${date - Date.now()} milisegundos`);
      }),
    );
  }
}
