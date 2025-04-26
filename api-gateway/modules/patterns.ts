export const patterns = {
  BOOK: {
    CREATE: { cmd: 'create_book' },
    FIND_ALL: { cmd: 'get_books' },
    FIND_BY_ID: { cmd: 'get_book_by_id' },
    UPDATE: { cmd: 'update_book' },
    DELETE: { cmd: 'delete_book' },
  },
  USER: {
    CREATE: { cmd: 'create_user' },
    FIND_ALL: { cmd: 'get_users' },
    FIND_BY_ID: { cmd: 'get_user_by_id' },
    UPDATE: { cmd: 'update_user' },
    DELETE: { cmd: 'delete_user' },
    FIND_BY_EMAIL: { cmd: 'find_user_by_email' },
    RESET_PASSWORD: { cmd: 'reset_password' },
  },
  AUTH: {
    VERIFY: { cmd: 'auth_verify_token' },
    TOKENS: { cmd: 'auth_generate_tokens' },
    REFRESH: { cmd: 'auth_refresh_tokens' },
  },
  READING: {
    CREATE: { cmd: 'create_reading_progress' },
    GET_BY_USER: { cmd: 'get_user_progress' },
    UPDATE: { cmd: 'update_reading_progress' },
  },
};