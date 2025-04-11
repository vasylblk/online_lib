export const patterns = {
  USER: {
    CREATE: { cmd: 'create_user' },
    FIND_ALL: { cmd: 'find_all_users' },
    FIND_BY_ID: { cmd: 'find_user_by_id' },
    UPDATE: { cmd: 'update_user' },
    DELETE: { cmd: 'delete_user' },
    FIND_BY_EMAIL: { cmd: 'find_user_by_email' },
    RESET_PASSWORD: { cmd: 'reset_password' },
  },

  BOOK: {
    CREATE: { cmd: 'create_book' },
    FIND_ALL: { cmd: 'get_books' },
    FIND_BY_ID: { cmd: 'get_book_by_id' },
    UPDATE: { cmd: 'update_book' },
    DELETE: { cmd: 'delete_book' },
  },

  AUTH: {
    TOKENS: { cmd: 'auth_generate_tokens' },
    VERIFY: { cmd: 'auth_verify_token' },
    REFRESH: { cmd: 'auth_refresh_tokens' },
  },
};
