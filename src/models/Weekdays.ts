import { Column, Entity, Generated, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Classroom from "./Classroom";
import Schedule from "./Schedules";

@Entity('weekdays')
export default class Weekdays {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    id: string;

    @Column()
    domingo: boolean;

    @Column()
    segunda: boolean;

    @Column()
    terca: boolean;

    @Column()
    quarta: boolean;

    @Column()
    quinta: boolean;

    @Column()
    sexta: boolean;

    @Column()
    sabado: boolean;

    @OneToMany(() => Classroom, classroom => classroom.weekday)
    classroom: Classroom[];
}