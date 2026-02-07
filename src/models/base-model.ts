import { db } from '@/database';
import { Knex } from 'knex';

export abstract class BaseModel<T extends Record<string, any>> {
  protected db: Knex;
  protected tableName: string;

  constructor(tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }

  // Get All records from the table
  async findAll(): Promise<T[]> {
    return this.db(this.tableName).select('*') as Promise<T[]>;
  }

  // Find a record by ID
  async findById(id: string): Promise<T | undefined> {
    return this.db(this.tableName).where({ id }).first() as Promise<T | undefined>;
  }

  // Create a new record
  async create(data: Partial<T>): Promise<T> {
    const [result] = await this.db(this.tableName).insert(data).returning('*');

    return result as T;
  }

  // update a record by Id
  async update(id: string, data: Partial<T>): Promise<T | undefined> {
    const [result] = await this.db(this.tableName)
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() })
      .returning('*');

    return result as T | undefined;
  }

  // Delete a record by ID

  async delete(id: string): Promise<boolean> {
    const deletedCount = await this.db(this.tableName).where({ id }).delete();

    return (deletedCount > 0) as boolean;
  }

  // check if a record exists by Id
  async exists(id: string): Promise<boolean> {
    const result = await this.db(this.tableName).where({ id }).first();

    return !!result as boolean;
  }

  // get count of records
  async count(where?: Partial<T>): Promise<number> {
    const result = await this.db(this.tableName)
      .where(where || {})
      .count('* as count')
      .first();

    return result ? parseInt(String(result.count), 10) : 0;
  }

  // Find records with conditions
  async findWhere(conditions: Partial<T>): Promise<T[]> {
    return this.db(this.tableName).where(conditions).select('*') as Promise<T[]>;
  }

  // find one record with conditions
  async findOneWhere(conditions: Partial<T>): Promise<T | undefined> {
    return this.db(this.tableName).where(conditions).first() as Promise<T | undefined>;
  }

  // get query builder for custom queries
  query() {
    return this.db<T>(this.tableName);
  }

  // transaction
  async transaction<R>(callback: (trx: Knex.Transaction) => Promise<R>): Promise<R> {
    return this.db.transaction(callback) as Promise<R>;
  }
}
