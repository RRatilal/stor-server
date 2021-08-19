import { Column, Entity, Generated, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Classroom from './Classroom';
import Images from './Images';

@Entity('user')
export default class User {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    whatsapp: string;

    @Column()
    bio: string;
    
    @Column({ nullable: true })
    resetToken: string;

    @OneToOne(() => Images, image => image.user, {
        cascade: ["insert", "update", "remove"],
    })
    image: Images;

    @OneToMany(() => Classroom, classroom => classroom.user, {
        cascade: ["insert", "update", "remove"],
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    classroom: Classroom[];
}