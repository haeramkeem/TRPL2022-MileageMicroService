import { Entity, PrimaryColumn } from 'typeorm';

@Entity('userData')
export class User {
    @PrimaryColumn()
    id: string;
}
