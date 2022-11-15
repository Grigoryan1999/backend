import { MigrationInterface, QueryRunner } from 'typeorm';

export class imageForProductColumnWasMade1668517095274
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "product" ADD COLUMN "picture" DEFAULT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "product" ADD COLUMN "cost" TYPE integer DEFAULT 0',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "product" DROP COLUMN "picture"');
    await queryRunner.query('ALTER TABLE "product" DROP COLUMN "cost"');
  }
}
