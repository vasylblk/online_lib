export default () => ({
  database: {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'mysql',
    database: process.env.DB_NAME ?? 'online_library',
    synchronize: false, // Використовуємо міграції
    autoLoadEntities: true, // Автоматичне завантаження сутностей
    migrationsRun: true,
    logging: true,
  },
});
