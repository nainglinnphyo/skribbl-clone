/* eslint-disable @typescript-eslint/return-await */
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { NestDrizzleAsyncOptions, NestDrizzleOptions, NestDrizzleOptionsFactory } from '@app/core/interfaces/drizzle.interface';
import { NEST_DRIZZLE_OPTIONS } from '@app/core/constants/db.constants';
import { DrizzleService } from './drizzle.service';
import { connectionFactory, createNestDrizzleProviders } from './drizzle.provider';

@Global()
@Module({
  providers: [DrizzleService, connectionFactory],
  exports: [DrizzleService, connectionFactory],
})
export class NestDrizzleModule {
  public static register(options: NestDrizzleOptions): DynamicModule {
    return {
      module: NestDrizzleModule,
      providers: createNestDrizzleProviders(options),
    };
  }

  public static registerAsync(options: NestDrizzleAsyncOptions): DynamicModule {
    return {
      module: NestDrizzleModule,
      providers: [...this.createProviders(options)],
    };
  }

  public static forRoot(options: NestDrizzleOptions): DynamicModule {
    const providers = createNestDrizzleProviders(options);
    return {
      module: NestDrizzleModule,
      providers,
      exports: providers,
    };
  }

  public static forRootAsync(options: NestDrizzleAsyncOptions): DynamicModule {
    return {
      module: NestDrizzleModule,
      providers: [...this.createProviders(options)],
      exports: [...this.createProviders(options)],
    };
  }

  private static createProviders(options: NestDrizzleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createOptionsProvider(options)];
    }

    return [
      this.createOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createOptionsProvider(options: NestDrizzleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: NEST_DRIZZLE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: NEST_DRIZZLE_OPTIONS,
      useFactory: async (optionsFactory: NestDrizzleOptionsFactory) => await optionsFactory.createNestDrizzleOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
