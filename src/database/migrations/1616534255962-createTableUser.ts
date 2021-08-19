import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createTableUser1616534255962 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'user',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'surname',
                    type: 'varchar',
                },
                {
                    name: 'email',
                    type: 'varchar',
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
                {
                    name: 'number',
                    type: 'varchar',
                },
                {
                    name: 'bio',
                    type: 'varchar',
                },
                {
                    name: 'resetToken',
                    type: 'varchar',
                    isNullable: true,
                },
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user');
    }

}
