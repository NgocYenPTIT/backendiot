import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';
@Entity({ name: 'history_actions' })
export class HistoryAction extends Base {
    @Column({ type: 'varchar', length: 255, name: 'fan' })
    fan: string;

    @Column({ type: 'varchar', length: 255, name: 'light' })
    light: string;

    @Column({ type: 'varchar', length: 255, name: 'ac' })
    ac: string;
}
