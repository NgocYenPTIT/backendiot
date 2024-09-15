// src/module/database/database.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class DatabaseService {
    constructor(@InjectDataSource() private dataSource: DataSource) { }

    getDataSource(): DataSource {
        return this.dataSource;
    }
}
