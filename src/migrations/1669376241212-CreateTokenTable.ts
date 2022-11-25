import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTokenTable1669376241212 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE public."token" (
                uuid serial4 NOT NULL,
                "token" varchar NOT NULL,
                updated_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
                created_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
                "productUuid" int4 NULL,
                CONSTRAINT "PK_a9a66098c2fb758dff713f8d838" PRIMARY KEY (uuid),
                CONSTRAINT "REL_4e81b906500212abec6c49ee55" UNIQUE ("userUuid")
            );`,
    );

    await queryRunner.query(
      `ALTER TABLE public."token" ADD CONSTRAINT "FK_baf6f8c56720ff78a877db2bbef" FOREIGN KEY ("productUuid") REFERENCES public."user"(uuid);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public.market_product DROP CONSTRAINT "FK_baf6f8c56720ff78a877db2bbef"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS public."token"`);
  }
}
