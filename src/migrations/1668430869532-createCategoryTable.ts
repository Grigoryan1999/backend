import { MigrationInterface, QueryRunner } from 'typeorm';

export class createCategoryTable1668430869532 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE public.category (
      uuid serial4 NOT NULL,
      "name" varchar NOT NULL,
      "subscription" varchar NOT NULL,
      updated_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
      CONSTRAINT "PK_86ee096735ccbfa3fd319af1833" PRIMARY KEY (uuid)
    );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.category`);
  }
}
