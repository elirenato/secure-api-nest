import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1666062791644 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.query(`
      CREATE TABLE countries (
        id serial4 NOT NULL,
        abbreviation varchar(3) NOT NULL,
        name varchar(255) NOT NULL,
        CONSTRAINT "countries_pk" PRIMARY KEY (id)
      );
    `);
    await queryRunner.query(
      `INSERT INTO countries (id, abbreviation, "name") VALUES (1, 'CAN', 'Canada');`,
    );
    await queryRunner.query(`CREATE TABLE state_provinces (
      id serial4 NOT NULL,
      abbreviation varchar(255) NOT NULL,
      "name" varchar(255) NOT NULL,
      country_id int4 NOT NULL,
      CONSTRAINT "state_province_pk" PRIMARY KEY (id),
      CONSTRAINT "country_id_fk" FOREIGN KEY (country_id) REFERENCES countries(id)
    );`);
    await queryRunner.query(`
      INSERT INTO state_provinces (id, abbreviation, "name", country_id) VALUES(1, 'AB', 'Alberta', 1);
      INSERT INTO state_provinces (id, abbreviation, "name", country_id) VALUES(2, 'BC', 'British Columbia', 1);
      INSERT INTO state_provinces (id, abbreviation, "name", country_id) VALUES(3, 'MB', 'Manitoba', 1);
      INSERT INTO state_provinces (id, abbreviation, "name", country_id) VALUES(4, 'NB', 'New Brunswick', 1);
      INSERT INTO state_provinces (id, abbreviation, "name", country_id) VALUES(5, 'NL', 'Newfoundland and Labrador', 1);
      INSERT INTO state_provinces (id, abbreviation, "name", country_id) VALUES(6, 'NS', 'Nova Scotia', 1);
      INSERT INTO state_provinces (id, abbreviation, "name", country_id) VALUES(7, 'ON', 'Ontario', 1);
      INSERT INTO state_provinces (id, abbreviation, "name", country_id) VALUES(8, 'PE', 'Prince Edward Island', 1);
      INSERT INTO state_provinces (id, abbreviation, "name", country_id) VALUES(9, 'QC', 'Quebec', 1);
      INSERT INTO state_provinces (id, abbreviation, "name", country_id) VALUES(10, 'SK', 'Saskatchewan', 1);
      INSERT INTO state_provinces (id, abbreviation, "name", country_id) VALUES(11, 'NT', 'Northwest Territories', 1);
      INSERT INTO state_provinces (id, abbreviation, "name", country_id) VALUES(12, 'NU', 'Nunavut', 1);
      INSERT INTO state_provinces (id, abbreviation, "name", country_id) VALUES(13, 'YT', 'Yukon', 1);
    `);
    await queryRunner.query(`
      CREATE TABLE customers (
          id serial4 NOT NULL,
          "firstName" varchar(255) NOT NULL,
          "lastName" varchar(255) NOT NULL,
          email varchar(255) NOT NULL,
          address varchar(255) NOT NULL,
          address2 varchar(255) NULL,
          "postalCode" varchar(30) NOT NULL,
          state_province_id int4 NOT NULL,
          CONSTRAINT "customers_pk" PRIMARY KEY (id),
          CONSTRAINT "state_province_id_fk" FOREIGN KEY (state_province_id) REFERENCES state_provinces(id)
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX customers_email_key ON customers USING btree (email);
    `);
  }
  async down(queryRunner: QueryRunner) {
    await queryRunner.query(`DROP TABLE customers;`);
    await queryRunner.query(`DROP TABLE state_provinces;`);
    await queryRunner.query(`DROP TABLE countries;`);
  }
}
