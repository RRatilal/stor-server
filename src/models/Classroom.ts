import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Schedules from './Schedules';
import User from './Users';
import Weekdays from './Weekdays';

@Entity('classroom')
export default class Classroom {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    id: string;

    @Column()
    subject!: string;

    @Column()
    cost: number;

    @ManyToOne(() => User, user => user.classroom)
    user: User;

    @ManyToOne(() => Weekdays, weekday => weekday.classroom, {
        cascade: ["insert", "update", "remove"],
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    weekday: Weekdays;

    @OneToMany(() => Schedules, schedule => schedule.classroom, {
        cascade: ["insert", "update", "remove"]
    })
    schedules: Schedules[];
}