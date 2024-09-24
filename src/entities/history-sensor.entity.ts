import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';
@Entity({ name: 'history_sensors' })
export class HistorySensor extends Base {
    @Column({ nullable: true, type: 'double', name: 'temperature' })
    temperature: number;

    @Column({ nullable: true, type: 'double', name: 'humid' })
    humid: number;

    @Column({ nullable: true, type: 'double', name: 'light' })
    light: number;
}
