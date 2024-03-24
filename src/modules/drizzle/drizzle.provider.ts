import { DRIZZLE_ORM, NEST_DRIZZLE_OPTIONS } from 'src/core/constants/db.constants';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { NestDrizzleOptions } from '@app/core/interfaces/drizzle.interface';
import { DrizzleService } from './drizzle.service';

export const connectionFactory = {
  provide: DRIZZLE_ORM,
  useFactory: async (nestDrizzleService: { getDrizzle: () => Promise<PostgresJsDatabase> }) => {
    return nestDrizzleService.getDrizzle();
  },
  inject: [DrizzleService],
};

export function createNestDrizzleProviders(options: NestDrizzleOptions) {
  return [
    {
      provide: NEST_DRIZZLE_OPTIONS,
      useValue: options,
    },
  ];
}
