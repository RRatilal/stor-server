import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createTableWeekdays1616535335599 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "weekdays",
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'gen_random_uuid()'
                },
                {
                    name: 'domingo',
                    type: 'boolean'
                },
                {
                    name: 'segunda',
                    type: 'boolean'
                },
                {
                    name: 'terca',
                    type: 'boolean'
                },
                {
                    name: 'quarta',
                    type: 'boolean'
                },
                {
                    name: 'quinta',
                    type: 'boolean'
                },
                {
                    name: 'sexta',
                    type: 'boolean'
                },
                {
                    name: 'sabado',
                    type: 'boolean'
                },
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('weekdays')
    }

}
