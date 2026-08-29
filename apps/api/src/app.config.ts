import {
  BadRequestException,
  StandardSchemaValidationPipe,
  type INestApplication,
} from '@nestjs/common';

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new StandardSchemaValidationPipe({
      transform: true,
      exceptionFactory: (issues) => {
        const details = issues.map((issue) => {
          const path = issue.path?.map(String).join('.');

          return path ? `${path}: ${issue.message}` : issue.message;
        });

        return new BadRequestException({
          code: 'VALIDATION_ERROR',
          message: 'La solicitud contiene datos inválidos.',
          details,
        });
      },
    }),
  );
}
