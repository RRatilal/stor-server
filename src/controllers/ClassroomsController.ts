import { Request, Response } from "express";
import { join } from "path";
import { Brackets, createQueryBuilder, getRepository, UpdateResult } from "typeorm";
import Classroom from "../models/Classroom";
import Schedule from "../models/Schedules";
import User from "../models/Users";
import WeekDays from "../models/Weekdays";
import convertHourToMinutes from "../utils/convertHoursToMinutes";

interface ScheduleItem {
    week_day: number,
    from: string,
    to: string,
  }

interface IDays {
    week_day: number
}

export default {
    async show(req:Request, res: Response) {
        const filters = req.query;

        const classroomsRepository = getRepository(Classroom);

        const subject = filters.subject as string;

        if (!filters.subject) {
            return res.status(400).json({
                error: 'Missing filters to serch classes'
            })
        }


        const classroom = await classroomsRepository.createQueryBuilder("classroom")
            .leftJoinAndSelect("classroom.user", "user", )
            .addSelect("user.password", "user")
            .addSelect("user.resetToken", "user")
            .leftJoinAndSelect("user.image", "image")
            .leftJoinAndSelect("classroom.weekday", "weekday")
            .leftJoinAndSelect("classroom.schedules", "schedules")
            .where("classroom.subject = :subject", { subject: subject })
            .getMany();

        return res.json(classroom)
    },

    async create(req:Request, res: Response) {
        const {userId} = req.params;
        const {subject, cost, schedules} = req.body;

        const usersRepository = getRepository(User);
        const classroomsRepository = getRepository(Classroom);
        const schedulesRepository = getRepository(Schedule);

        // Find user and return id
        const user = await usersRepository.findOneOrFail(userId)
        .then(user => {
            return user.id
        })
        .catch(() => {
            return undefined
        });

        // Find Classroom based on user id and subject end return
        const existClassroom = await classroomsRepository.findOne({
            where: {
                user: userId,
                subject
            }
        }).then(existClassroom => {
            return {
                id: existClassroom.id,
                subject: existClassroom.subject
            }
        }).catch(() => {
            return undefined
        })

        // Check if user is undefined
        if (user == undefined) {
            return res.status(400).json({ message: "User not found" })
        }

        // Mapping schedule given by the body
        const classSchedule = schedules.map((scheduleItem: ScheduleItem) => ({
            week_day: scheduleItem.week_day,
            from: convertHourToMinutes(scheduleItem.from),
            to: convertHourToMinutes(scheduleItem.to)
        }));

        const days: number[] = classSchedule.map((day: IDays) => (
            day.week_day
        ))

        const weekday = {
            domingo: days.find(day => day === 1) ? true : false,
            segunda: days.find(day => day === 2) ? true : false,
            terca: days.find(day => day === 3) ? true : false,
            quarta: days.find(day => day === 4) ? true : false,
            quinta: days.find(day => day === 5) ? true : false,
            sexta: days.find(day => day === 6) ? true : false,
            sabado: days.find(day => day === 7) ? true : false,
        };
        
        try {
            let classroom: Classroom | Promise<UpdateResult>;

            if (existClassroom == undefined) {
                classroom = classroomsRepository.create({
                    subject,
                    cost,
                    schedules: classSchedule,
                    user,
                    weekday
                })

                await classroomsRepository.save(classroom)
            }
            
            if (existClassroom != undefined && existClassroom.subject === subject) {

                classroom = classroomsRepository.create({
                    id: existClassroom.id,
                    subject,
                    cost,
                    schedules: classSchedule,
                    user,
                    weekday
                })

                await classroomsRepository.save(classroom)
                await schedulesRepository.delete({
                    classroom: null
                })
            } 
            
            return res.json(classroom)
        } catch (error) {
            console.log(error)
        }
    }
}