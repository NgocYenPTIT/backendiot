import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                // Tại đây bạn có thể xử lý lỗi hoặc ghi log
                console.error('Exception caught by interceptor:', error.message);

                // Ném lại lỗi để tiếp tục xử lý trong NestJS (nếu cần)
                throw error;
            }),
        );
    }
}
