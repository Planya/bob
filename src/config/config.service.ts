import { TypeOrmModuleOptions } from '@nestjs/typeorm'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key]
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`)
    }

    return value
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true))
    return this
  }

  public getPrefix() {
    return this.getValue('BOT_PREFIX', true)
  }

  public getPort() {
    return this.getValue('PORT', true)
  }

  public getToken() {
    if (this.isProduction()) {
      return this.getValue('PROD_TOKEN', true)
    } else {
      return this.getValue('DEV_TOKEN', true)
    }
  }

  public getIp() {
    return this.getValue('IP', true)
  }

  public getLogChannel() {
    return this.getValue('LOG_CHANNEL', true)
  }

  public getTWSecret() {
    return this.getValue('TW_SECRET_KEY', true)
  }

  public getTWClient() {
    return this.getValue('TW_CLIENT_KEY', true)
  }

  public getApiKey() {
    return this.getValue('YT_API_KEY', true)
  }

  public isProduction() {
    const mode = this.getValue('MODE', false)
    return mode != 'DEV'
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
])

export { configService }
