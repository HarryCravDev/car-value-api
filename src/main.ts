import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieSession({
    name: 'session',
    keys: ['asherobne']
  }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  );

  app.use(function(req: any, res: any, next: any){
    req.sessionOptions.maxAge = 10000;
    next();
  });

  await app.listen(3000);
}
bootstrap();
