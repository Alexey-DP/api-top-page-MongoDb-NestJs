import { DynamicModule, Module, Provider, Global } from '@nestjs/common';
import { TELEGRAM_MODULE_OPTIONS } from '../constants/telegram.constants';
import { ITelegramModuleAsyncOptions } from './telegram.interface';
import { TelegramService } from './telegram.service';

@Global()
@Module({})
export class TelegramModule {
  static forRootAsync(options: ITelegramModuleAsyncOptions): DynamicModule {
    const asyncOptions = this.createAsyncOptionsProvider(options);
    return {
      module: TelegramModule,
      imports: options.imports,
      providers: [TelegramService, asyncOptions],
      exports: [TelegramService]
    }
  }

  private static createAsyncOptionsProvider(options: ITelegramModuleAsyncOptions): Provider {
    return {
      provide: TELEGRAM_MODULE_OPTIONS,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        return config;
      },
      inject: options.inject || []
    }
  }
}
