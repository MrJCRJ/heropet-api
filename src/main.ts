// File: src/main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Habilita transformação automática
      transformOptions: {
        enableImplicitConversion: true, // Permite conversão implícita
      },
      whitelist: true, // Remove propriedades não decoradas
      forbidNonWhitelisted: false, // Não rejeita requisições com propriedades extras
    })
  );

  await app.listen(3000, "0.0.0.0");
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
