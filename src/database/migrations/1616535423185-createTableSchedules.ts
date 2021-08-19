import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createTableSchedules1616535423185 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'schedules',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'week_day',
                    type: 'integer',
                },
                {
                    name: 'from',
                    type: 'integer',
                },
                {
                    name: 'to',
                    type: 'integer',
                }
            ],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('schedules')
    }

}
