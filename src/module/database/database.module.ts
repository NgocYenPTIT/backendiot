import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfiguration } from 'src/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: () => DatabaseConfiguration as DataSourceOptions,
            inject: [ConfigService],
        }),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService]
})
export class DatabaseModule { }
