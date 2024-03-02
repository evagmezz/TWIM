import { MigrationInterface, QueryRunner } from 'typeorm'

export class Locations1709388088315 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSON cube')
    await queryRunner.query('CREATE EXTENSON earthdistance')

    await queryRunner.query(
      `CREATE TABLE locations(
           id        SERIAL PRIMARY KEY,
           post_id   VARCHAR(255)     NOT NULL,
           name      VARCHAR(255)     NOT NULL,
           latitude  DOUBLE PRECISION NOT NULL,
           longitude DOUBLE PRECISION NOT NULL
       )`,
    )

    await queryRunner.query(
      'CREATE INDEX idx_locations_point ON locations USING gist (ll_to_earth(latitude, longitude))',
    )

    await queryRunner.query(
      'CREATE INDEX idx_locations_name ON locations USING btree(lower((name)::text))',
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE locations')
    await queryRunner.query('DROP EXTENSION cube')
    await queryRunner.query('DROP EXTENSION earthdistance')
  }
}
