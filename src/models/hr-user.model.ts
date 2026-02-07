import bcrypt from 'bcrypt';
import type { HrUser, HrUserCreate } from '@/types/models';
import { BaseModel } from './base-model';
import { env } from '@/config/env';

export class HrUserModel extends BaseModel<HrUser> {
  constructor() {
    super('hr_users');
  }

  // Find HR user by email
  async findByEmail(email: string): Promise<HrUser | undefined> {
    return this.db<HrUser>(this.tableName).where({ email }).first();
  }

  // Create new HR user
  async createHrUser(data: HrUserCreate): Promise<HrUser> {
    const [user] = await this.db<HrUser>(this.tableName)
      .insert({
        ...data,
        created_at: this.db.fn.now(),
        updated_at: this.db.fn.now(),
      })
      .returning('*');

    return user;
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, env.saltRounds);
  }

  // verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // check if email exists
  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);

    return !!user;
  }

  // update HR user password
  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(newPassword);
    const updated = await this.update(id, { password_hash: passwordHash } as Partial<HrUser>);

    return !!updated;
  }

  // get hr user without password hash
  async findByIdSafe(id: string): Promise<Omit<HrUser, 'password_hash'> | undefined> {
    return this.db<HrUser>(this.tableName)
      .where({ id })
      .select('id', 'name', 'email', 'created_at', 'updated_at')
      .first();
  }

  // get all HR users without password hash
  async findAllSafe(): Promise<Omit<HrUser, 'password_hash'>[]> {
    return this.db<HrUser>(this.tableName).select(
      'id',
      'name',
      'email',
      'created_at',
      'updated_at'
    );
  }
}
