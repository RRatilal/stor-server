import { Column, Entity, Generated, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './Users';

@Entity('images')
export default class Images {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    url: string;

    @OneToOne(() => User, user => user.image)
    @JoinColumn()
    user: User;
}