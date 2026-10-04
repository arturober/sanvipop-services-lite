import { defineConfig, SqliteDriver } from '@mikro-orm/sql';
import { SqliteDialect } from 'kysely';
import { DatabaseSync } from 'node:sqlite';
import { Category } from '../modules/categories/entities/category.entity.js';
import { Product } from '../modules/products/entities/product.entity.js';
import { ProductPhoto } from '../modules/products/entities/product-photo.entity.js';

/**
 * Dialecto SQLite basado en el módulo nativo 'node:sqlite' de Node 24+,
 * sin requerir compilación C++ (better-sqlite3) ni herramientas de compilación en Windows.
 */
export class NodeSqliteDialect extends SqliteDialect {
  constructor(dbName: string) {
    super({
      database: async () => {
        const db = new DatabaseSync(dbName);
        return {
          prepare(sql: string) {
            const stmt = db.prepare(sql);
            return {
              reader: /^\s*(select|pragma|explain|with)/i.test(sql) || /\breturning\b/i.test(sql),
              all: (params: any[]) => stmt.all(...params),
              run: (params: any[]) => stmt.run(...params),
              get: (params: any[]) => stmt.get(...params),
              iterate: (params: any[]) => stmt.iterate(...params),
            };
          },
          close() {
            db.close();
          },
        };
      },
    });
  }
}

const dbName = process.env.DB_NAME || 'sanvipop.db';

export default defineConfig({
  driver: SqliteDriver,
  dbName,
  driverOptions: new NodeSqliteDialect(dbName),
  entities: [Category, Product, ProductPhoto],
  debug: process.env.NODE_ENV !== 'production',
});
