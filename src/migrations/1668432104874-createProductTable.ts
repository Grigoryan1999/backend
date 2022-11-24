import { MigrationInterface, QueryRunner } from 'typeorm';

export class createProductTable1668432104874 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE public.product (
        uuid serial4 NOT NULL,
        "name" varchar NOT NULL,
        "subscription" varchar NOT NULL,
        updated_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
        created_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
        drink bool NOT NULL,
        CONSTRAINT "PK_1442fd7cb5e0b32ff5d0b6c13d0" PRIMARY KEY (uuid)
    );`,
    );

    await queryRunner.query(
      `CREATE TABLE public.category_products_product (
        "categoryUuid" int4 NOT NULL,
        "productUuid" int4 NOT NULL,
        CONSTRAINT "PK_19f71d93906e5c373f3d47319cd" PRIMARY KEY ("categoryUuid", "productUuid")
      );
      CREATE INDEX "IDX_89b3f303aacf922af380391cb8" ON public.category_products_product USING btree ("categoryUuid");
      CREATE INDEX "IDX_923ad539acd9f99312befc95e4" ON public.category_products_product USING btree ("productUuid");
      
      
      -- public.category_products_product foreign keys
      
      ALTER TABLE public.category_products_product ADD CONSTRAINT "FK_89b3f303aacf922af380391cb88" FOREIGN KEY ("categoryUuid") REFERENCES public.category(uuid) ON DELETE CASCADE ON UPDATE CASCADE;
      ALTER TABLE public.category_products_product ADD CONSTRAINT "FK_923ad539acd9f99312befc95e4d" FOREIGN KEY ("productUuid") REFERENCES public.product(uuid) ON DELETE CASCADE ON UPDATE CASCADE;`,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.product`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS public.category_products_product`,
    );
  }
}
