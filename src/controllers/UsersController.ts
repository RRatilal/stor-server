import { Request, Response } from "express";
import { getRepository, UpdateResult } from "typeorm";
import bcrypt from  'bcrypt';
import { secret } from '../config/auth.json';
import JWT from 'jsonwebtoken';
import User from "../models/Users";
import Image from '../models/Images';
import hashPassword from "../utils/hashPassword";
import generateAuthToken from "../config/generateAuthToken";
import generateRefreshToken from "../config/generateRefreshToken";
import mailer from "../modules/mailer";

export default {
    async index(req: Request, res: Response) {
        const { email, password } = req.body;
        const usersRepository = getRepository(User)

        try {
            let user = await usersRepository.findOne({
                where: {
                    email
                },
                select: [("password")]
            }).then(response => {
                return response
            })
    
            if (!user) {
                return res.status(400).json({ error: "Email inválido" })
            }
    
            const isPasswordMash = await bcrypt.compare(password, user.password);
            if (!isPasswordMash) {
                return res.status(400).json({ error: "senha inválida" })
            }
    
            user = await usersRepository.findOne({
                where: {
                    email
                },
                select: ["id", "name", "surname", "email", "whatsapp", "bio"]
            }).then(response => {
                return response
            });
            let token
            let refreshToken
            if (user) {
                token = await generateAuthToken(user.id);
                refreshToken = await generateRefreshToken(user.id);
            }
    
            return res.json({ user, token, refreshToken })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: "Erro ao carregar dados do usuario" })
        }
        
    },

    async create(req: Request, res: Response) {
        const { name, surname, email, password, whatsapp, bio } = req.body;

        const usersRepository = getRepository(User)

        try {
            let user = await usersRepository.findOne({
                where: {
                    email
                }
            });
    
            if (user) {
                return res.status(400).json({ message: "Já existe um usuário com esse email" })
            }
    
            user = usersRepository.create({
                name,
                surname,
                email,
                password: await hashPassword(password),
                whatsapp,
                bio
            });
    
            await usersRepository.save(user);
    
            return res.status(200).json({ message: `usuario: ${user.name}, criado com sucesso!` });
        } catch (error) {
            return res.status(400).json({ error: "Erro ao criar usuario" })
        }
    },

    async update(req: Request, res: Response) {
        const { userId } = req.params;
        const { name, surname, email, whatsapp, bio } = req.body;
        const imageFile = req.file;

        const usersRepository = getRepository(User);
        const imageRepository = getRepository(Image);

        

        try {

            const insertedUser = await usersRepository.findOne({
                where: {
                    id: userId,
                }
            });

            if (!insertedUser) {
                return res.status(400).json({ error: 'Esse usuário não existe' })
            }

            if (imageFile) {
                const imageName = imageFile.filename
                const url = `http://localhost:3333/uploads/${imageFile.filename}`;

                const insertedImage = await imageRepository.findOne({
                    where: {
                        name: imageName
                    }
                });

                let image: Image | Promise<UpdateResult>;

                if (!insertedImage) {
                    image = imageRepository.create({
                        name: imageName,
                        url,
                        user: insertedUser
                    });

                    await imageRepository.save(image)
                } else {
                    image = imageRepository.create({
                        id: insertedImage.id,
                        name: imageName,
                        url,
                        user: insertedUser
                    })

                    await imageRepository.save(image)
                }
            }

        await usersRepository.update(insertedUser.id, {
            name,
            surname,
            email,
            whatsapp,
            bio,
        });

        return res.status(200).json();
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error })
        }
    },

    async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        const usersRepository = getRepository(User);

        try {
            const user = await usersRepository.findOne({
                where: {
                    email
                },
                
            }).then(response => {
                return response
            })
    
            if (!user) {
                return res.status(400).json({ error: "Email inválido" })
            }
    
            const token = await generateAuthToken(user.id);
    
            await usersRepository.update(
                user.id, 
                {resetToken: token}
            ).then(response => {
                return response
            })
    
            mailer.sendMail({
                to: email,
                from: 'rachidratilal@gmail.com',
                template: 'auth/forgot_password',
                context: { token },
            }, (err) => {
                if (err)
                    // console.log(err)
                    return res.status(400).json({ error: 'Não pode enviar email de esquecí minha' });
    
                return res.json()
            })
        } catch (error) {
            res.status(400).json({ erro: 'Ocorreu um erro, tente navamente!' })
        }
    },

    async getUpdatedData(req: Request, res: Response) {
        const { userId } = req.params;

        const usersRepository = getRepository(User)
        
        try {
            const user = await usersRepository.createQueryBuilder("users")
                .leftJoinAndSelect("users.image", "image")
                .where("users.id = :id", { id: userId })
                .getMany();
    
            return res.status(200).json(user)
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: "Erro ao carregar dados" })
        }
    },

    async resetPassword(req: Request, res: Response) {
        const { email, password } = req.body;
        const { token } = req.params;

        const usersRepository = getRepository(User)

        try {
            const user = await usersRepository.findOne({
                where: {
                    email
                },
                select: ["id", "resetToken"]
            }).then(response => {
                return response
            })

            if (!user) {
                return res.status(400).json({ error: "Email inválido" })
            }

            if (token !== user.resetToken) {
                return res.status(400).json({ error: "o token é inválido" })
            }

            JWT.verify(token, secret, async (err) => {
                if (err) {
                    return res.status(401).json({ error: "O token expirou" });
                };

                const passwordHashed = await bcrypt.hash(password, 10);

                await usersRepository.update(user.id, {
                    password: passwordHashed
                })
            })

        } catch (error) {
            res.status(400).json({ error: "Não pode resetar a senha, por favor tente de novo!" })
        }
    }
}