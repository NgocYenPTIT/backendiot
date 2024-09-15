import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';
@Entity({ name: 'history_actions' })
export class HistoryAction extends Base {
    @Column({ nullable: true, type: 'int', name: 'fan' })
    fan: number;

    @Column({ nullable: true, type: 'int', name: 'light' })
    light: number;

    @Column({ nullable: true, type: 'int', name: 'ac' })
    ac: number;
}
