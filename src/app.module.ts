import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { Note } from './notes/note.entity';
import { NoteModule } from './notes/note.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import cookieSession from 'cookie-session';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
            type: "sqlite",
            database: config.get<string>('DB_NAME'),
            entities: [User, Report, Note],
            synchronize: true
        }
      }
    }),
    // TypeOrmModule.forRoot({
    //   type: "sqlite",
    //   database: "db.sqlite",
    //   entities: [User, Report, Note],
    //   synchronize: true
    // }),
    // TypeOrmModule.forRoot({
    //   type: "mongodb",
    //   host: "localhost",
    //   port: 27017,
    //   database: "Users_Test",
    //   entities: [User, Report],
    //   synchronize: true
    // }),
    UsersModule,
    ReportsModule,
    NoteModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer){
  //   consumer.apply(
  //     cookieSession({
  //       keys: ['qowhfnzlsrh']
  //     })
  //   ).forRoutes('*');
  // }
}
