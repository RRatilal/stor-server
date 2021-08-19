import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Connections from "../models/Connections";
import User from "../models/Users";

export default {
    async index(req: Request, res: Response) {
        const connectionsRepository = getRepository(Connections);

    const total = await connectionsRepository.count();

        return res.json({total})
    },

    async create(req: Request, res: Response) {
        const { user_id } = req.body;

        const usersRepository = getRepository(User);
        const connectionsRepository = getRepository(Connections);

        const user = await usersRepository.findOneOrFail(user_id)
        .then(user => {
            return user
        })
        .catch(() => {
            return undefined
        });

        // const connection = connectionsRepository.create({
        //     user
        // });

        // await connectionsRepository.save(connection);

        return res.status(201).send();
    }
}