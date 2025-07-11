import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['*'],
  });

  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não têm decorators no DTO
      forbidNonWhitelisted: true, // Retorna erro se receber propriedades extras
      transform: true, // Converte automaticamente tipos (ex: string para number)
      // optional: disableErrorMessages: true, // para não expor detalhes de erros em produção
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
