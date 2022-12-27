import { MigrationInterface, QueryRunner } from 'typeorm';

export class userTablesWereMade1668519122727 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" (
        "uuid" SERIAL NOT NULL, "name" varchar NOT NULL, "default" boolean NOT NULL DEFAULT false,
        "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
        "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
        CONSTRAINT "PK_16fc336b9576146aa1f03fdc7c5" PRIMARY KEY ("uuid")
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE public."user" (
        uuid serial4 NOT NULL,
        login varchar NOT NULL,
        email varchar NOT NULL,
        "name" varchar NOT NULL,
        "password" varchar NOT NULL,
        updated_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
        created_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
        "roleUuid" int4 NULL,
        CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY (uuid)
      );`,
    );
    await queryRunner.query(
      `ALTER TABLE public."user" ADD CONSTRAINT "FK_8ffce172fb81226c738cef01e31" FOREIGN KEY ("roleUuid") REFERENCES public."role"(uuid);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public."role"`);
    await queryRunner.query(`DROP TABLE IF EXISTS public."user"`);
  }
}
