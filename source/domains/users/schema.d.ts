/**
 * The UUID of the User
 */
export type UserID = string;
/**
 * The Email of the User
 */
export type UserEmail = string;
/**
 * Password. If used in Database, it is Hashed. If in Client Input, it is plaintext
 */
export type UserPassword = string;
/**
 * When the User was actually saved into the Database
 */
export type UserCreatedAt = string;

/**
 * User of the Bible Search system
 */
export interface DatabaseUser {
  id: UserID;
  email: UserEmail;
  password: UserPassword;
  meta: UserMeta;
  created_at: UserCreatedAt;
  [k: string]: unknown;
}
/**
 * The User-added information such as Avatar and Phone/Address
 */
export interface UserMeta {
  [k: string]: unknown;
}
/**
 * The UUID of the User
 */

/**
 * The Email of the User
 */

/**
 * When the User was actually saved into the Database
 */


/**
 * What we make available to the general public
 */
export interface PublicReadUser {
  id: UserID;
  email: UserEmail;
  meta: UserMeta;
  created_at: UserCreatedAt;
  [k: string]: unknown;
}
/**
 * The User-added information such as Avatar and Phone/Address
 */

/**
 * The Email of the User
 */

/**
 * Password. If used in Database, it is Hashed. If in Client Input, it is plaintext
 */


/**
 * The input needed from the Client to create a User
 */
export interface CreateUser {
  email: UserEmail;
  meta?: UserMeta;
  password: UserPassword;
  [k: string]: unknown;
}
/**
 * The User-added information such as Avatar and Phone/Address
 */

