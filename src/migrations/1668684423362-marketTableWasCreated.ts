import { MigrationInterface, QueryRunner } from 'typeorm';

export class marketTableWasCreated1668684423362 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE public.market (
        uuid serial4 NOT NULL,
        address varchar NOT NULL,
        latitude int4 NOT NULL,
        longitude int4 NOT NULL,
        updated_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
        created_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
        CONSTRAINT "PK_ff4126341cc558b02777e8e12a8" PRIMARY KEY (uuid)
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE public.market_product (
        uuid serial4 NOT NULL,
        count int4 NOT NULL DEFAULT 0,
        updated_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
        created_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
        "productUuid" int4 NULL,
        "marketUuid" int4 NULL,
        CONSTRAINT "PK_d54c54fcffe31f0b95522fc6934" PRIMARY KEY (uuid)
      );`,
    );
    await queryRunner.query(
      `ALTER TABLE public.market_product ADD CONSTRAINT "FK_463676ad2c1b91d1cdf4dc4d4c7" FOREIGN KEY ("marketUuid") REFERENCES public.market(uuid);`,
    );
    await queryRunner.query(
      `ALTER TABLE public.market_product ADD CONSTRAINT "FK_f6197dafe11f5b1cbaebe80011f" FOREIGN KEY ("productUuid") REFERENCES public.product(uuid);`,
    );
    await queryRunner.query(
      'ALTER TABLE public.market_product ADD COLUMN "cost" TYPE integer DEFAULT 0',
    );
    await queryRunner.query(
      'ALTER TABLE public.market_product ADD COLUMN "discount" TYPE integer DEFAULT 0',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.market`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.market_product`);
    await queryRunner.query(
      `ALTER TABLE public.market_product DROP CONSTRAINT "FK_463676ad2c1b91d1cdf4dc4d4c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE public.market_product DROP CONSTRAINT "FK_f6197dafe11f5b1cbaebe80011f"`,
    );
    await queryRunner.query(
      'ALTER TABLE public.market_product DROP COLUMN "cost"',
    );
    await queryRunner.query(
      'ALTER TABLE public.market_product DROP COLUMN "discount"',
    );
  }
}
