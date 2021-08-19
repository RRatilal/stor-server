import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import User from './Users';

@Entity('connections')
export default class Connections {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    id: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}