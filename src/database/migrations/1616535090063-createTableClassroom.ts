import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createTableClassroom1616535090063 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'classroom',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'subject',
                    type: 'varchar'
                },
                {
                    name: 'cost',
                    type: 'integer'
                },
            ],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('classroom')
    }

}
