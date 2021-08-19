import {MigrationInterface, QueryRunner} from "typeorm";

export class relationBetweenTables1623971224972 implements MigrationInterface {
    name = 'relationBetweenTables1623971224972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "number" TO "whatsapp"`);
        await queryRunner.query(`ALTER TABLE "connections" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD "classroomId" uuid`);
        await queryRunner.query(`ALTER TABLE "images" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "UQ_96514329909c945f10974aff5f8" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "classroom" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "classroom" ADD "weekdayId" uuid`);
        await queryRunner.query(`COMMENT ON COLUMN "connections"."created_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_a47c1aff265560f98e9c863d96c" FOREIGN KEY ("classroomId") REFERENCES "classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_96514329909c945f10974aff5f8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classroom" ADD CONSTRAINT "FK_6f2187911a8faba7c91a83194d9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classroom" ADD CONSTRAINT "FK_f307faba15760320f73badab2d3" FOREIGN KEY ("weekdayId") REFERENCES "weekdays"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classroom" DROP CONSTRAINT "FK_f307faba15760320f73badab2d3"`);
        await queryRunner.query(`ALTER TABLE "classroom" DROP CONSTRAINT "FK_6f2187911a8faba7c91a83194d9"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_96514329909c945f10974aff5f8"`);
        await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_a47c1aff265560f98e9c863d96c"`);
        await queryRunner.query(`COMMENT ON COLUMN "connections"."created_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "classroom" DROP COLUMN "weekdayId"`);
        await queryRunner.query(`ALTER TABLE "classroom" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "UQ_96514329909c945f10974aff5f8"`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "classroomId"`);
        await queryRunner.query(`ALTER TABLE "connections" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "whatsapp" TO "number"`);
    }

}
