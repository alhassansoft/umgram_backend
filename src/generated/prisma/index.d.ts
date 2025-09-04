
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ChatConversation
 * 
 */
export type ChatConversation = $Result.DefaultSelection<Prisma.$ChatConversationPayload>
/**
 * Model ChatMessage
 * 
 */
export type ChatMessage = $Result.DefaultSelection<Prisma.$ChatMessagePayload>
/**
 * Model ConfessionConversation
 * 
 */
export type ConfessionConversation = $Result.DefaultSelection<Prisma.$ConfessionConversationPayload>
/**
 * Model ConfessionMessage
 * 
 */
export type ConfessionMessage = $Result.DefaultSelection<Prisma.$ConfessionMessagePayload>
/**
 * Model MediaAlbum
 * 
 */
export type MediaAlbum = $Result.DefaultSelection<Prisma.$MediaAlbumPayload>
/**
 * Model MediaAsset
 * 
 */
export type MediaAsset = $Result.DefaultSelection<Prisma.$MediaAssetPayload>
/**
 * Model MatchRequest
 * 
 */
export type MatchRequest = $Result.DefaultSelection<Prisma.$MatchRequestPayload>
/**
 * Model MatchCandidate
 * 
 */
export type MatchCandidate = $Result.DefaultSelection<Prisma.$MatchCandidatePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ChatSource: {
  DIARY: 'DIARY',
  NOTE: 'NOTE'
};

export type ChatSource = (typeof ChatSource)[keyof typeof ChatSource]


export const ChatMode: {
  WIDE: 'WIDE',
  STRICT: 'STRICT'
};

export type ChatMode = (typeof ChatMode)[keyof typeof ChatMode]


export const MatchCandidateStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED'
};

export type MatchCandidateStatus = (typeof MatchCandidateStatus)[keyof typeof MatchCandidateStatus]


export const MatchRequestStatus: {
  PENDING: 'PENDING',
  MATCHED: 'MATCHED',
  NOT_FOUND: 'NOT_FOUND',
  CANCELED: 'CANCELED'
};

export type MatchRequestStatus = (typeof MatchRequestStatus)[keyof typeof MatchRequestStatus]

}

export type ChatSource = $Enums.ChatSource

export const ChatSource: typeof $Enums.ChatSource

export type ChatMode = $Enums.ChatMode

export const ChatMode: typeof $Enums.ChatMode

export type MatchCandidateStatus = $Enums.MatchCandidateStatus

export const MatchCandidateStatus: typeof $Enums.MatchCandidateStatus

export type MatchRequestStatus = $Enums.MatchRequestStatus

export const MatchRequestStatus: typeof $Enums.MatchRequestStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ChatConversations
 * const chatConversations = await prisma.chatConversation.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more ChatConversations
   * const chatConversations = await prisma.chatConversation.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.chatConversation`: Exposes CRUD operations for the **ChatConversation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatConversations
    * const chatConversations = await prisma.chatConversation.findMany()
    * ```
    */
  get chatConversation(): Prisma.ChatConversationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatMessages
    * const chatMessages = await prisma.chatMessage.findMany()
    * ```
    */
  get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.confessionConversation`: Exposes CRUD operations for the **ConfessionConversation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConfessionConversations
    * const confessionConversations = await prisma.confessionConversation.findMany()
    * ```
    */
  get confessionConversation(): Prisma.ConfessionConversationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.confessionMessage`: Exposes CRUD operations for the **ConfessionMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConfessionMessages
    * const confessionMessages = await prisma.confessionMessage.findMany()
    * ```
    */
  get confessionMessage(): Prisma.ConfessionMessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mediaAlbum`: Exposes CRUD operations for the **MediaAlbum** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MediaAlbums
    * const mediaAlbums = await prisma.mediaAlbum.findMany()
    * ```
    */
  get mediaAlbum(): Prisma.MediaAlbumDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mediaAsset`: Exposes CRUD operations for the **MediaAsset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MediaAssets
    * const mediaAssets = await prisma.mediaAsset.findMany()
    * ```
    */
  get mediaAsset(): Prisma.MediaAssetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.matchRequest`: Exposes CRUD operations for the **MatchRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MatchRequests
    * const matchRequests = await prisma.matchRequest.findMany()
    * ```
    */
  get matchRequest(): Prisma.MatchRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.matchCandidate`: Exposes CRUD operations for the **MatchCandidate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MatchCandidates
    * const matchCandidates = await prisma.matchCandidate.findMany()
    * ```
    */
  get matchCandidate(): Prisma.MatchCandidateDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.14.0
   * Query Engine version: 717184b7b35ea05dfa71a3236b7af656013e1e49
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    ChatConversation: 'ChatConversation',
    ChatMessage: 'ChatMessage',
    ConfessionConversation: 'ConfessionConversation',
    ConfessionMessage: 'ConfessionMessage',
    MediaAlbum: 'MediaAlbum',
    MediaAsset: 'MediaAsset',
    MatchRequest: 'MatchRequest',
    MatchCandidate: 'MatchCandidate'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "chatConversation" | "chatMessage" | "confessionConversation" | "confessionMessage" | "mediaAlbum" | "mediaAsset" | "matchRequest" | "matchCandidate"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ChatConversation: {
        payload: Prisma.$ChatConversationPayload<ExtArgs>
        fields: Prisma.ChatConversationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatConversationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatConversationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>
          }
          findFirst: {
            args: Prisma.ChatConversationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatConversationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>
          }
          findMany: {
            args: Prisma.ChatConversationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>[]
          }
          create: {
            args: Prisma.ChatConversationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>
          }
          createMany: {
            args: Prisma.ChatConversationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatConversationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>[]
          }
          delete: {
            args: Prisma.ChatConversationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>
          }
          update: {
            args: Prisma.ChatConversationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>
          }
          deleteMany: {
            args: Prisma.ChatConversationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatConversationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatConversationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>[]
          }
          upsert: {
            args: Prisma.ChatConversationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>
          }
          aggregate: {
            args: Prisma.ChatConversationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatConversation>
          }
          groupBy: {
            args: Prisma.ChatConversationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatConversationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatConversationCountArgs<ExtArgs>
            result: $Utils.Optional<ChatConversationCountAggregateOutputType> | number
          }
        }
      }
      ChatMessage: {
        payload: Prisma.$ChatMessagePayload<ExtArgs>
        fields: Prisma.ChatMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findFirst: {
            args: Prisma.ChatMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findMany: {
            args: Prisma.ChatMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          create: {
            args: Prisma.ChatMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          createMany: {
            args: Prisma.ChatMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          delete: {
            args: Prisma.ChatMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          update: {
            args: Prisma.ChatMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          deleteMany: {
            args: Prisma.ChatMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          upsert: {
            args: Prisma.ChatMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          aggregate: {
            args: Prisma.ChatMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatMessage>
          }
          groupBy: {
            args: Prisma.ChatMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageCountAggregateOutputType> | number
          }
        }
      }
      ConfessionConversation: {
        payload: Prisma.$ConfessionConversationPayload<ExtArgs>
        fields: Prisma.ConfessionConversationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConfessionConversationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionConversationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConfessionConversationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionConversationPayload>
          }
          findFirst: {
            args: Prisma.ConfessionConversationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionConversationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConfessionConversationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionConversationPayload>
          }
          findMany: {
            args: Prisma.ConfessionConversationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionConversationPayload>[]
          }
          create: {
            args: Prisma.ConfessionConversationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionConversationPayload>
          }
          createMany: {
            args: Prisma.ConfessionConversationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConfessionConversationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionConversationPayload>[]
          }
          delete: {
            args: Prisma.ConfessionConversationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionConversationPayload>
          }
          update: {
            args: Prisma.ConfessionConversationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionConversationPayload>
          }
          deleteMany: {
            args: Prisma.ConfessionConversationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConfessionConversationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConfessionConversationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionConversationPayload>[]
          }
          upsert: {
            args: Prisma.ConfessionConversationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionConversationPayload>
          }
          aggregate: {
            args: Prisma.ConfessionConversationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConfessionConversation>
          }
          groupBy: {
            args: Prisma.ConfessionConversationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConfessionConversationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConfessionConversationCountArgs<ExtArgs>
            result: $Utils.Optional<ConfessionConversationCountAggregateOutputType> | number
          }
        }
      }
      ConfessionMessage: {
        payload: Prisma.$ConfessionMessagePayload<ExtArgs>
        fields: Prisma.ConfessionMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConfessionMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConfessionMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionMessagePayload>
          }
          findFirst: {
            args: Prisma.ConfessionMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConfessionMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionMessagePayload>
          }
          findMany: {
            args: Prisma.ConfessionMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionMessagePayload>[]
          }
          create: {
            args: Prisma.ConfessionMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionMessagePayload>
          }
          createMany: {
            args: Prisma.ConfessionMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConfessionMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionMessagePayload>[]
          }
          delete: {
            args: Prisma.ConfessionMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionMessagePayload>
          }
          update: {
            args: Prisma.ConfessionMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionMessagePayload>
          }
          deleteMany: {
            args: Prisma.ConfessionMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConfessionMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConfessionMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionMessagePayload>[]
          }
          upsert: {
            args: Prisma.ConfessionMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfessionMessagePayload>
          }
          aggregate: {
            args: Prisma.ConfessionMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConfessionMessage>
          }
          groupBy: {
            args: Prisma.ConfessionMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConfessionMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConfessionMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ConfessionMessageCountAggregateOutputType> | number
          }
        }
      }
      MediaAlbum: {
        payload: Prisma.$MediaAlbumPayload<ExtArgs>
        fields: Prisma.MediaAlbumFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MediaAlbumFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAlbumPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MediaAlbumFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAlbumPayload>
          }
          findFirst: {
            args: Prisma.MediaAlbumFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAlbumPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MediaAlbumFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAlbumPayload>
          }
          findMany: {
            args: Prisma.MediaAlbumFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAlbumPayload>[]
          }
          create: {
            args: Prisma.MediaAlbumCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAlbumPayload>
          }
          createMany: {
            args: Prisma.MediaAlbumCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MediaAlbumCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAlbumPayload>[]
          }
          delete: {
            args: Prisma.MediaAlbumDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAlbumPayload>
          }
          update: {
            args: Prisma.MediaAlbumUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAlbumPayload>
          }
          deleteMany: {
            args: Prisma.MediaAlbumDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MediaAlbumUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MediaAlbumUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAlbumPayload>[]
          }
          upsert: {
            args: Prisma.MediaAlbumUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAlbumPayload>
          }
          aggregate: {
            args: Prisma.MediaAlbumAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMediaAlbum>
          }
          groupBy: {
            args: Prisma.MediaAlbumGroupByArgs<ExtArgs>
            result: $Utils.Optional<MediaAlbumGroupByOutputType>[]
          }
          count: {
            args: Prisma.MediaAlbumCountArgs<ExtArgs>
            result: $Utils.Optional<MediaAlbumCountAggregateOutputType> | number
          }
        }
      }
      MediaAsset: {
        payload: Prisma.$MediaAssetPayload<ExtArgs>
        fields: Prisma.MediaAssetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MediaAssetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MediaAssetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>
          }
          findFirst: {
            args: Prisma.MediaAssetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MediaAssetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>
          }
          findMany: {
            args: Prisma.MediaAssetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>[]
          }
          create: {
            args: Prisma.MediaAssetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>
          }
          createMany: {
            args: Prisma.MediaAssetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MediaAssetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>[]
          }
          delete: {
            args: Prisma.MediaAssetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>
          }
          update: {
            args: Prisma.MediaAssetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>
          }
          deleteMany: {
            args: Prisma.MediaAssetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MediaAssetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MediaAssetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>[]
          }
          upsert: {
            args: Prisma.MediaAssetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaAssetPayload>
          }
          aggregate: {
            args: Prisma.MediaAssetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMediaAsset>
          }
          groupBy: {
            args: Prisma.MediaAssetGroupByArgs<ExtArgs>
            result: $Utils.Optional<MediaAssetGroupByOutputType>[]
          }
          count: {
            args: Prisma.MediaAssetCountArgs<ExtArgs>
            result: $Utils.Optional<MediaAssetCountAggregateOutputType> | number
          }
        }
      }
      MatchRequest: {
        payload: Prisma.$MatchRequestPayload<ExtArgs>
        fields: Prisma.MatchRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchRequestPayload>
          }
          findFirst: {
            args: Prisma.MatchRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchRequestPayload>
          }
          findMany: {
            args: Prisma.MatchRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchRequestPayload>[]
          }
          create: {
            args: Prisma.MatchRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchRequestPayload>
          }
          createMany: {
            args: Prisma.MatchRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchRequestPayload>[]
          }
          delete: {
            args: Prisma.MatchRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchRequestPayload>
          }
          update: {
            args: Prisma.MatchRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchRequestPayload>
          }
          deleteMany: {
            args: Prisma.MatchRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchRequestPayload>[]
          }
          upsert: {
            args: Prisma.MatchRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchRequestPayload>
          }
          aggregate: {
            args: Prisma.MatchRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatchRequest>
          }
          groupBy: {
            args: Prisma.MatchRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchRequestCountArgs<ExtArgs>
            result: $Utils.Optional<MatchRequestCountAggregateOutputType> | number
          }
        }
      }
      MatchCandidate: {
        payload: Prisma.$MatchCandidatePayload<ExtArgs>
        fields: Prisma.MatchCandidateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchCandidateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchCandidatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchCandidateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchCandidatePayload>
          }
          findFirst: {
            args: Prisma.MatchCandidateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchCandidatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchCandidateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchCandidatePayload>
          }
          findMany: {
            args: Prisma.MatchCandidateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchCandidatePayload>[]
          }
          create: {
            args: Prisma.MatchCandidateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchCandidatePayload>
          }
          createMany: {
            args: Prisma.MatchCandidateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchCandidateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchCandidatePayload>[]
          }
          delete: {
            args: Prisma.MatchCandidateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchCandidatePayload>
          }
          update: {
            args: Prisma.MatchCandidateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchCandidatePayload>
          }
          deleteMany: {
            args: Prisma.MatchCandidateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchCandidateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchCandidateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchCandidatePayload>[]
          }
          upsert: {
            args: Prisma.MatchCandidateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchCandidatePayload>
          }
          aggregate: {
            args: Prisma.MatchCandidateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatchCandidate>
          }
          groupBy: {
            args: Prisma.MatchCandidateGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchCandidateGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchCandidateCountArgs<ExtArgs>
            result: $Utils.Optional<MatchCandidateCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    chatConversation?: ChatConversationOmit
    chatMessage?: ChatMessageOmit
    confessionConversation?: ConfessionConversationOmit
    confessionMessage?: ConfessionMessageOmit
    mediaAlbum?: MediaAlbumOmit
    mediaAsset?: MediaAssetOmit
    matchRequest?: MatchRequestOmit
    matchCandidate?: MatchCandidateOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ChatConversationCountOutputType
   */

  export type ChatConversationCountOutputType = {
    messages: number
  }

  export type ChatConversationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ChatConversationCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ChatConversationCountOutputType without action
   */
  export type ChatConversationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversationCountOutputType
     */
    select?: ChatConversationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChatConversationCountOutputType without action
   */
  export type ChatConversationCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
  }


  /**
   * Count Type ConfessionConversationCountOutputType
   */

  export type ConfessionConversationCountOutputType = {
    messages: number
  }

  export type ConfessionConversationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ConfessionConversationCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ConfessionConversationCountOutputType without action
   */
  export type ConfessionConversationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionConversationCountOutputType
     */
    select?: ConfessionConversationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ConfessionConversationCountOutputType without action
   */
  export type ConfessionConversationCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConfessionMessageWhereInput
  }


  /**
   * Count Type MediaAlbumCountOutputType
   */

  export type MediaAlbumCountOutputType = {
    assets: number
  }

  export type MediaAlbumCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assets?: boolean | MediaAlbumCountOutputTypeCountAssetsArgs
  }

  // Custom InputTypes
  /**
   * MediaAlbumCountOutputType without action
   */
  export type MediaAlbumCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAlbumCountOutputType
     */
    select?: MediaAlbumCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MediaAlbumCountOutputType without action
   */
  export type MediaAlbumCountOutputTypeCountAssetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MediaAssetWhereInput
  }


  /**
   * Count Type MatchRequestCountOutputType
   */

  export type MatchRequestCountOutputType = {
    candidates: number
  }

  export type MatchRequestCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    candidates?: boolean | MatchRequestCountOutputTypeCountCandidatesArgs
  }

  // Custom InputTypes
  /**
   * MatchRequestCountOutputType without action
   */
  export type MatchRequestCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchRequestCountOutputType
     */
    select?: MatchRequestCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MatchRequestCountOutputType without action
   */
  export type MatchRequestCountOutputTypeCountCandidatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchCandidateWhereInput
  }


  /**
   * Models
   */

  /**
   * Model ChatConversation
   */

  export type AggregateChatConversation = {
    _count: ChatConversationCountAggregateOutputType | null
    _min: ChatConversationMinAggregateOutputType | null
    _max: ChatConversationMaxAggregateOutputType | null
  }

  export type ChatConversationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChatConversationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChatConversationCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChatConversationMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChatConversationMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChatConversationCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChatConversationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatConversation to aggregate.
     */
    where?: ChatConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatConversations to fetch.
     */
    orderBy?: ChatConversationOrderByWithRelationInput | ChatConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatConversations
    **/
    _count?: true | ChatConversationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatConversationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatConversationMaxAggregateInputType
  }

  export type GetChatConversationAggregateType<T extends ChatConversationAggregateArgs> = {
        [P in keyof T & keyof AggregateChatConversation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatConversation[P]>
      : GetScalarType<T[P], AggregateChatConversation[P]>
  }




  export type ChatConversationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatConversationWhereInput
    orderBy?: ChatConversationOrderByWithAggregationInput | ChatConversationOrderByWithAggregationInput[]
    by: ChatConversationScalarFieldEnum[] | ChatConversationScalarFieldEnum
    having?: ChatConversationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatConversationCountAggregateInputType | true
    _min?: ChatConversationMinAggregateInputType
    _max?: ChatConversationMaxAggregateInputType
  }

  export type ChatConversationGroupByOutputType = {
    id: string
    userId: string | null
    title: string | null
    createdAt: Date
    updatedAt: Date
    _count: ChatConversationCountAggregateOutputType | null
    _min: ChatConversationMinAggregateOutputType | null
    _max: ChatConversationMaxAggregateOutputType | null
  }

  type GetChatConversationGroupByPayload<T extends ChatConversationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatConversationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatConversationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatConversationGroupByOutputType[P]>
            : GetScalarType<T[P], ChatConversationGroupByOutputType[P]>
        }
      >
    >


  export type ChatConversationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    messages?: boolean | ChatConversation$messagesArgs<ExtArgs>
    _count?: boolean | ChatConversationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatConversation"]>

  export type ChatConversationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["chatConversation"]>

  export type ChatConversationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["chatConversation"]>

  export type ChatConversationSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChatConversationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "createdAt" | "updatedAt", ExtArgs["result"]["chatConversation"]>
  export type ChatConversationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ChatConversation$messagesArgs<ExtArgs>
    _count?: boolean | ChatConversationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChatConversationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ChatConversationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ChatConversationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatConversation"
    objects: {
      messages: Prisma.$ChatMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      title: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["chatConversation"]>
    composites: {}
  }

  type ChatConversationGetPayload<S extends boolean | null | undefined | ChatConversationDefaultArgs> = $Result.GetResult<Prisma.$ChatConversationPayload, S>

  type ChatConversationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatConversationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatConversationCountAggregateInputType | true
    }

  export interface ChatConversationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatConversation'], meta: { name: 'ChatConversation' } }
    /**
     * Find zero or one ChatConversation that matches the filter.
     * @param {ChatConversationFindUniqueArgs} args - Arguments to find a ChatConversation
     * @example
     * // Get one ChatConversation
     * const chatConversation = await prisma.chatConversation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatConversationFindUniqueArgs>(args: SelectSubset<T, ChatConversationFindUniqueArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatConversation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatConversationFindUniqueOrThrowArgs} args - Arguments to find a ChatConversation
     * @example
     * // Get one ChatConversation
     * const chatConversation = await prisma.chatConversation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatConversationFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatConversation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatConversationFindFirstArgs} args - Arguments to find a ChatConversation
     * @example
     * // Get one ChatConversation
     * const chatConversation = await prisma.chatConversation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatConversationFindFirstArgs>(args?: SelectSubset<T, ChatConversationFindFirstArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatConversation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatConversationFindFirstOrThrowArgs} args - Arguments to find a ChatConversation
     * @example
     * // Get one ChatConversation
     * const chatConversation = await prisma.chatConversation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatConversationFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatConversations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatConversationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatConversations
     * const chatConversations = await prisma.chatConversation.findMany()
     * 
     * // Get first 10 ChatConversations
     * const chatConversations = await prisma.chatConversation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatConversationWithIdOnly = await prisma.chatConversation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatConversationFindManyArgs>(args?: SelectSubset<T, ChatConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatConversation.
     * @param {ChatConversationCreateArgs} args - Arguments to create a ChatConversation.
     * @example
     * // Create one ChatConversation
     * const ChatConversation = await prisma.chatConversation.create({
     *   data: {
     *     // ... data to create a ChatConversation
     *   }
     * })
     * 
     */
    create<T extends ChatConversationCreateArgs>(args: SelectSubset<T, ChatConversationCreateArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatConversations.
     * @param {ChatConversationCreateManyArgs} args - Arguments to create many ChatConversations.
     * @example
     * // Create many ChatConversations
     * const chatConversation = await prisma.chatConversation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatConversationCreateManyArgs>(args?: SelectSubset<T, ChatConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatConversations and returns the data saved in the database.
     * @param {ChatConversationCreateManyAndReturnArgs} args - Arguments to create many ChatConversations.
     * @example
     * // Create many ChatConversations
     * const chatConversation = await prisma.chatConversation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatConversations and only return the `id`
     * const chatConversationWithIdOnly = await prisma.chatConversation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatConversationCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatConversation.
     * @param {ChatConversationDeleteArgs} args - Arguments to delete one ChatConversation.
     * @example
     * // Delete one ChatConversation
     * const ChatConversation = await prisma.chatConversation.delete({
     *   where: {
     *     // ... filter to delete one ChatConversation
     *   }
     * })
     * 
     */
    delete<T extends ChatConversationDeleteArgs>(args: SelectSubset<T, ChatConversationDeleteArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatConversation.
     * @param {ChatConversationUpdateArgs} args - Arguments to update one ChatConversation.
     * @example
     * // Update one ChatConversation
     * const chatConversation = await prisma.chatConversation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatConversationUpdateArgs>(args: SelectSubset<T, ChatConversationUpdateArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatConversations.
     * @param {ChatConversationDeleteManyArgs} args - Arguments to filter ChatConversations to delete.
     * @example
     * // Delete a few ChatConversations
     * const { count } = await prisma.chatConversation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatConversationDeleteManyArgs>(args?: SelectSubset<T, ChatConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatConversationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatConversations
     * const chatConversation = await prisma.chatConversation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatConversationUpdateManyArgs>(args: SelectSubset<T, ChatConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatConversations and returns the data updated in the database.
     * @param {ChatConversationUpdateManyAndReturnArgs} args - Arguments to update many ChatConversations.
     * @example
     * // Update many ChatConversations
     * const chatConversation = await prisma.chatConversation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatConversations and only return the `id`
     * const chatConversationWithIdOnly = await prisma.chatConversation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatConversationUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatConversationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatConversation.
     * @param {ChatConversationUpsertArgs} args - Arguments to update or create a ChatConversation.
     * @example
     * // Update or create a ChatConversation
     * const chatConversation = await prisma.chatConversation.upsert({
     *   create: {
     *     // ... data to create a ChatConversation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatConversation we want to update
     *   }
     * })
     */
    upsert<T extends ChatConversationUpsertArgs>(args: SelectSubset<T, ChatConversationUpsertArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatConversationCountArgs} args - Arguments to filter ChatConversations to count.
     * @example
     * // Count the number of ChatConversations
     * const count = await prisma.chatConversation.count({
     *   where: {
     *     // ... the filter for the ChatConversations we want to count
     *   }
     * })
    **/
    count<T extends ChatConversationCountArgs>(
      args?: Subset<T, ChatConversationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatConversationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatConversationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatConversationAggregateArgs>(args: Subset<T, ChatConversationAggregateArgs>): Prisma.PrismaPromise<GetChatConversationAggregateType<T>>

    /**
     * Group by ChatConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatConversationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatConversationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatConversationGroupByArgs['orderBy'] }
        : { orderBy?: ChatConversationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatConversation model
   */
  readonly fields: ChatConversationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatConversation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatConversationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    messages<T extends ChatConversation$messagesArgs<ExtArgs> = {}>(args?: Subset<T, ChatConversation$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatConversation model
   */
  interface ChatConversationFieldRefs {
    readonly id: FieldRef<"ChatConversation", 'String'>
    readonly userId: FieldRef<"ChatConversation", 'String'>
    readonly title: FieldRef<"ChatConversation", 'String'>
    readonly createdAt: FieldRef<"ChatConversation", 'DateTime'>
    readonly updatedAt: FieldRef<"ChatConversation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatConversation findUnique
   */
  export type ChatConversationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * Filter, which ChatConversation to fetch.
     */
    where: ChatConversationWhereUniqueInput
  }

  /**
   * ChatConversation findUniqueOrThrow
   */
  export type ChatConversationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * Filter, which ChatConversation to fetch.
     */
    where: ChatConversationWhereUniqueInput
  }

  /**
   * ChatConversation findFirst
   */
  export type ChatConversationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * Filter, which ChatConversation to fetch.
     */
    where?: ChatConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatConversations to fetch.
     */
    orderBy?: ChatConversationOrderByWithRelationInput | ChatConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatConversations.
     */
    cursor?: ChatConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatConversations.
     */
    distinct?: ChatConversationScalarFieldEnum | ChatConversationScalarFieldEnum[]
  }

  /**
   * ChatConversation findFirstOrThrow
   */
  export type ChatConversationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * Filter, which ChatConversation to fetch.
     */
    where?: ChatConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatConversations to fetch.
     */
    orderBy?: ChatConversationOrderByWithRelationInput | ChatConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatConversations.
     */
    cursor?: ChatConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatConversations.
     */
    distinct?: ChatConversationScalarFieldEnum | ChatConversationScalarFieldEnum[]
  }

  /**
   * ChatConversation findMany
   */
  export type ChatConversationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * Filter, which ChatConversations to fetch.
     */
    where?: ChatConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatConversations to fetch.
     */
    orderBy?: ChatConversationOrderByWithRelationInput | ChatConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatConversations.
     */
    cursor?: ChatConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatConversations.
     */
    skip?: number
    distinct?: ChatConversationScalarFieldEnum | ChatConversationScalarFieldEnum[]
  }

  /**
   * ChatConversation create
   */
  export type ChatConversationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatConversation.
     */
    data: XOR<ChatConversationCreateInput, ChatConversationUncheckedCreateInput>
  }

  /**
   * ChatConversation createMany
   */
  export type ChatConversationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatConversations.
     */
    data: ChatConversationCreateManyInput | ChatConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatConversation createManyAndReturn
   */
  export type ChatConversationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * The data used to create many ChatConversations.
     */
    data: ChatConversationCreateManyInput | ChatConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatConversation update
   */
  export type ChatConversationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatConversation.
     */
    data: XOR<ChatConversationUpdateInput, ChatConversationUncheckedUpdateInput>
    /**
     * Choose, which ChatConversation to update.
     */
    where: ChatConversationWhereUniqueInput
  }

  /**
   * ChatConversation updateMany
   */
  export type ChatConversationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatConversations.
     */
    data: XOR<ChatConversationUpdateManyMutationInput, ChatConversationUncheckedUpdateManyInput>
    /**
     * Filter which ChatConversations to update
     */
    where?: ChatConversationWhereInput
    /**
     * Limit how many ChatConversations to update.
     */
    limit?: number
  }

  /**
   * ChatConversation updateManyAndReturn
   */
  export type ChatConversationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * The data used to update ChatConversations.
     */
    data: XOR<ChatConversationUpdateManyMutationInput, ChatConversationUncheckedUpdateManyInput>
    /**
     * Filter which ChatConversations to update
     */
    where?: ChatConversationWhereInput
    /**
     * Limit how many ChatConversations to update.
     */
    limit?: number
  }

  /**
   * ChatConversation upsert
   */
  export type ChatConversationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatConversation to update in case it exists.
     */
    where: ChatConversationWhereUniqueInput
    /**
     * In case the ChatConversation found by the `where` argument doesn't exist, create a new ChatConversation with this data.
     */
    create: XOR<ChatConversationCreateInput, ChatConversationUncheckedCreateInput>
    /**
     * In case the ChatConversation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatConversationUpdateInput, ChatConversationUncheckedUpdateInput>
  }

  /**
   * ChatConversation delete
   */
  export type ChatConversationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * Filter which ChatConversation to delete.
     */
    where: ChatConversationWhereUniqueInput
  }

  /**
   * ChatConversation deleteMany
   */
  export type ChatConversationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatConversations to delete
     */
    where?: ChatConversationWhereInput
    /**
     * Limit how many ChatConversations to delete.
     */
    limit?: number
  }

  /**
   * ChatConversation.messages
   */
  export type ChatConversation$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    cursor?: ChatMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatConversation without action
   */
  export type ChatConversationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
  }


  /**
   * Model ChatMessage
   */

  export type AggregateChatMessage = {
    _count: ChatMessageCountAggregateOutputType | null
    _avg: ChatMessageAvgAggregateOutputType | null
    _sum: ChatMessageSumAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  export type ChatMessageAvgAggregateOutputType = {
    answersCount: number | null
  }

  export type ChatMessageSumAggregateOutputType = {
    answersCount: number | null
  }

  export type ChatMessageMinAggregateOutputType = {
    id: string | null
    conversationId: string | null
    role: string | null
    text: string | null
    source: $Enums.ChatSource | null
    mode: $Enums.ChatMode | null
    answersCount: number | null
    finalType: string | null
    createdAt: Date | null
  }

  export type ChatMessageMaxAggregateOutputType = {
    id: string | null
    conversationId: string | null
    role: string | null
    text: string | null
    source: $Enums.ChatSource | null
    mode: $Enums.ChatMode | null
    answersCount: number | null
    finalType: string | null
    createdAt: Date | null
  }

  export type ChatMessageCountAggregateOutputType = {
    id: number
    conversationId: number
    role: number
    text: number
    source: number
    mode: number
    answersCount: number
    finalType: number
    meta: number
    createdAt: number
    _all: number
  }


  export type ChatMessageAvgAggregateInputType = {
    answersCount?: true
  }

  export type ChatMessageSumAggregateInputType = {
    answersCount?: true
  }

  export type ChatMessageMinAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    text?: true
    source?: true
    mode?: true
    answersCount?: true
    finalType?: true
    createdAt?: true
  }

  export type ChatMessageMaxAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    text?: true
    source?: true
    mode?: true
    answersCount?: true
    finalType?: true
    createdAt?: true
  }

  export type ChatMessageCountAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    text?: true
    source?: true
    mode?: true
    answersCount?: true
    finalType?: true
    meta?: true
    createdAt?: true
    _all?: true
  }

  export type ChatMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessage to aggregate.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatMessages
    **/
    _count?: true | ChatMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChatMessageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChatMessageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMessageMaxAggregateInputType
  }

  export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateChatMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatMessage[P]>
      : GetScalarType<T[P], AggregateChatMessage[P]>
  }




  export type ChatMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithAggregationInput | ChatMessageOrderByWithAggregationInput[]
    by: ChatMessageScalarFieldEnum[] | ChatMessageScalarFieldEnum
    having?: ChatMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatMessageCountAggregateInputType | true
    _avg?: ChatMessageAvgAggregateInputType
    _sum?: ChatMessageSumAggregateInputType
    _min?: ChatMessageMinAggregateInputType
    _max?: ChatMessageMaxAggregateInputType
  }

  export type ChatMessageGroupByOutputType = {
    id: string
    conversationId: string
    role: string
    text: string
    source: $Enums.ChatSource | null
    mode: $Enums.ChatMode | null
    answersCount: number | null
    finalType: string | null
    meta: JsonValue | null
    createdAt: Date
    _count: ChatMessageCountAggregateOutputType | null
    _avg: ChatMessageAvgAggregateOutputType | null
    _sum: ChatMessageSumAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
        }
      >
    >


  export type ChatMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    text?: boolean
    source?: boolean
    mode?: boolean
    answersCount?: boolean
    finalType?: boolean
    meta?: boolean
    createdAt?: boolean
    conversation?: boolean | ChatConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    text?: boolean
    source?: boolean
    mode?: boolean
    answersCount?: boolean
    finalType?: boolean
    meta?: boolean
    createdAt?: boolean
    conversation?: boolean | ChatConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    text?: boolean
    source?: boolean
    mode?: boolean
    answersCount?: boolean
    finalType?: boolean
    meta?: boolean
    createdAt?: boolean
    conversation?: boolean | ChatConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectScalar = {
    id?: boolean
    conversationId?: boolean
    role?: boolean
    text?: boolean
    source?: boolean
    mode?: boolean
    answersCount?: boolean
    finalType?: boolean
    meta?: boolean
    createdAt?: boolean
  }

  export type ChatMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "conversationId" | "role" | "text" | "source" | "mode" | "answersCount" | "finalType" | "meta" | "createdAt", ExtArgs["result"]["chatMessage"]>
  export type ChatMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ChatConversationDefaultArgs<ExtArgs>
  }
  export type ChatMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ChatConversationDefaultArgs<ExtArgs>
  }
  export type ChatMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ChatConversationDefaultArgs<ExtArgs>
  }

  export type $ChatMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatMessage"
    objects: {
      conversation: Prisma.$ChatConversationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conversationId: string
      role: string
      text: string
      source: $Enums.ChatSource | null
      mode: $Enums.ChatMode | null
      answersCount: number | null
      finalType: string | null
      meta: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["chatMessage"]>
    composites: {}
  }

  type ChatMessageGetPayload<S extends boolean | null | undefined | ChatMessageDefaultArgs> = $Result.GetResult<Prisma.$ChatMessagePayload, S>

  type ChatMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatMessageCountAggregateInputType | true
    }

  export interface ChatMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatMessage'], meta: { name: 'ChatMessage' } }
    /**
     * Find zero or one ChatMessage that matches the filter.
     * @param {ChatMessageFindUniqueArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatMessageFindUniqueArgs>(args: SelectSubset<T, ChatMessageFindUniqueArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatMessageFindUniqueOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatMessageFindFirstArgs>(args?: SelectSubset<T, ChatMessageFindFirstArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany()
     * 
     * // Get first 10 ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatMessageFindManyArgs>(args?: SelectSubset<T, ChatMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatMessage.
     * @param {ChatMessageCreateArgs} args - Arguments to create a ChatMessage.
     * @example
     * // Create one ChatMessage
     * const ChatMessage = await prisma.chatMessage.create({
     *   data: {
     *     // ... data to create a ChatMessage
     *   }
     * })
     * 
     */
    create<T extends ChatMessageCreateArgs>(args: SelectSubset<T, ChatMessageCreateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatMessages.
     * @param {ChatMessageCreateManyArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatMessageCreateManyArgs>(args?: SelectSubset<T, ChatMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatMessages and returns the data saved in the database.
     * @param {ChatMessageCreateManyAndReturnArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatMessage.
     * @param {ChatMessageDeleteArgs} args - Arguments to delete one ChatMessage.
     * @example
     * // Delete one ChatMessage
     * const ChatMessage = await prisma.chatMessage.delete({
     *   where: {
     *     // ... filter to delete one ChatMessage
     *   }
     * })
     * 
     */
    delete<T extends ChatMessageDeleteArgs>(args: SelectSubset<T, ChatMessageDeleteArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatMessage.
     * @param {ChatMessageUpdateArgs} args - Arguments to update one ChatMessage.
     * @example
     * // Update one ChatMessage
     * const chatMessage = await prisma.chatMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatMessageUpdateArgs>(args: SelectSubset<T, ChatMessageUpdateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatMessages.
     * @param {ChatMessageDeleteManyArgs} args - Arguments to filter ChatMessages to delete.
     * @example
     * // Delete a few ChatMessages
     * const { count } = await prisma.chatMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatMessageDeleteManyArgs>(args?: SelectSubset<T, ChatMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatMessageUpdateManyArgs>(args: SelectSubset<T, ChatMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages and returns the data updated in the database.
     * @param {ChatMessageUpdateManyAndReturnArgs} args - Arguments to update many ChatMessages.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatMessage.
     * @param {ChatMessageUpsertArgs} args - Arguments to update or create a ChatMessage.
     * @example
     * // Update or create a ChatMessage
     * const chatMessage = await prisma.chatMessage.upsert({
     *   create: {
     *     // ... data to create a ChatMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMessage we want to update
     *   }
     * })
     */
    upsert<T extends ChatMessageUpsertArgs>(args: SelectSubset<T, ChatMessageUpsertArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageCountArgs} args - Arguments to filter ChatMessages to count.
     * @example
     * // Count the number of ChatMessages
     * const count = await prisma.chatMessage.count({
     *   where: {
     *     // ... the filter for the ChatMessages we want to count
     *   }
     * })
    **/
    count<T extends ChatMessageCountArgs>(
      args?: Subset<T, ChatMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatMessageAggregateArgs>(args: Subset<T, ChatMessageAggregateArgs>): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>

    /**
     * Group by ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatMessageGroupByArgs['orderBy'] }
        : { orderBy?: ChatMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatMessage model
   */
  readonly fields: ChatMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    conversation<T extends ChatConversationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChatConversationDefaultArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatMessage model
   */
  interface ChatMessageFieldRefs {
    readonly id: FieldRef<"ChatMessage", 'String'>
    readonly conversationId: FieldRef<"ChatMessage", 'String'>
    readonly role: FieldRef<"ChatMessage", 'String'>
    readonly text: FieldRef<"ChatMessage", 'String'>
    readonly source: FieldRef<"ChatMessage", 'ChatSource'>
    readonly mode: FieldRef<"ChatMessage", 'ChatMode'>
    readonly answersCount: FieldRef<"ChatMessage", 'Int'>
    readonly finalType: FieldRef<"ChatMessage", 'String'>
    readonly meta: FieldRef<"ChatMessage", 'Json'>
    readonly createdAt: FieldRef<"ChatMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatMessage findUnique
   */
  export type ChatMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findUniqueOrThrow
   */
  export type ChatMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findFirst
   */
  export type ChatMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findFirstOrThrow
   */
  export type ChatMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findMany
   */
  export type ChatMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessages to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage create
   */
  export type ChatMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatMessage.
     */
    data: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
  }

  /**
   * ChatMessage createMany
   */
  export type ChatMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatMessage createManyAndReturn
   */
  export type ChatMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage update
   */
  export type ChatMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatMessage.
     */
    data: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
    /**
     * Choose, which ChatMessage to update.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage updateMany
   */
  export type ChatMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
  }

  /**
   * ChatMessage updateManyAndReturn
   */
  export type ChatMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage upsert
   */
  export type ChatMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatMessage to update in case it exists.
     */
    where: ChatMessageWhereUniqueInput
    /**
     * In case the ChatMessage found by the `where` argument doesn't exist, create a new ChatMessage with this data.
     */
    create: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
    /**
     * In case the ChatMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
  }

  /**
   * ChatMessage delete
   */
  export type ChatMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter which ChatMessage to delete.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage deleteMany
   */
  export type ChatMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessages to delete
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to delete.
     */
    limit?: number
  }

  /**
   * ChatMessage without action
   */
  export type ChatMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
  }


  /**
   * Model ConfessionConversation
   */

  export type AggregateConfessionConversation = {
    _count: ConfessionConversationCountAggregateOutputType | null
    _min: ConfessionConversationMinAggregateOutputType | null
    _max: ConfessionConversationMaxAggregateOutputType | null
  }

  export type ConfessionConversationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConfessionConversationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConfessionConversationCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ConfessionConversationMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConfessionConversationMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConfessionConversationCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ConfessionConversationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConfessionConversation to aggregate.
     */
    where?: ConfessionConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfessionConversations to fetch.
     */
    orderBy?: ConfessionConversationOrderByWithRelationInput | ConfessionConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConfessionConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfessionConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfessionConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConfessionConversations
    **/
    _count?: true | ConfessionConversationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConfessionConversationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConfessionConversationMaxAggregateInputType
  }

  export type GetConfessionConversationAggregateType<T extends ConfessionConversationAggregateArgs> = {
        [P in keyof T & keyof AggregateConfessionConversation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConfessionConversation[P]>
      : GetScalarType<T[P], AggregateConfessionConversation[P]>
  }




  export type ConfessionConversationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConfessionConversationWhereInput
    orderBy?: ConfessionConversationOrderByWithAggregationInput | ConfessionConversationOrderByWithAggregationInput[]
    by: ConfessionConversationScalarFieldEnum[] | ConfessionConversationScalarFieldEnum
    having?: ConfessionConversationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConfessionConversationCountAggregateInputType | true
    _min?: ConfessionConversationMinAggregateInputType
    _max?: ConfessionConversationMaxAggregateInputType
  }

  export type ConfessionConversationGroupByOutputType = {
    id: string
    userId: string | null
    title: string | null
    createdAt: Date
    updatedAt: Date
    _count: ConfessionConversationCountAggregateOutputType | null
    _min: ConfessionConversationMinAggregateOutputType | null
    _max: ConfessionConversationMaxAggregateOutputType | null
  }

  type GetConfessionConversationGroupByPayload<T extends ConfessionConversationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConfessionConversationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConfessionConversationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConfessionConversationGroupByOutputType[P]>
            : GetScalarType<T[P], ConfessionConversationGroupByOutputType[P]>
        }
      >
    >


  export type ConfessionConversationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    messages?: boolean | ConfessionConversation$messagesArgs<ExtArgs>
    _count?: boolean | ConfessionConversationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["confessionConversation"]>

  export type ConfessionConversationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["confessionConversation"]>

  export type ConfessionConversationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["confessionConversation"]>

  export type ConfessionConversationSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ConfessionConversationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "createdAt" | "updatedAt", ExtArgs["result"]["confessionConversation"]>
  export type ConfessionConversationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ConfessionConversation$messagesArgs<ExtArgs>
    _count?: boolean | ConfessionConversationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ConfessionConversationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ConfessionConversationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ConfessionConversationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConfessionConversation"
    objects: {
      messages: Prisma.$ConfessionMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      title: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["confessionConversation"]>
    composites: {}
  }

  type ConfessionConversationGetPayload<S extends boolean | null | undefined | ConfessionConversationDefaultArgs> = $Result.GetResult<Prisma.$ConfessionConversationPayload, S>

  type ConfessionConversationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConfessionConversationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConfessionConversationCountAggregateInputType | true
    }

  export interface ConfessionConversationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConfessionConversation'], meta: { name: 'ConfessionConversation' } }
    /**
     * Find zero or one ConfessionConversation that matches the filter.
     * @param {ConfessionConversationFindUniqueArgs} args - Arguments to find a ConfessionConversation
     * @example
     * // Get one ConfessionConversation
     * const confessionConversation = await prisma.confessionConversation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConfessionConversationFindUniqueArgs>(args: SelectSubset<T, ConfessionConversationFindUniqueArgs<ExtArgs>>): Prisma__ConfessionConversationClient<$Result.GetResult<Prisma.$ConfessionConversationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ConfessionConversation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConfessionConversationFindUniqueOrThrowArgs} args - Arguments to find a ConfessionConversation
     * @example
     * // Get one ConfessionConversation
     * const confessionConversation = await prisma.confessionConversation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConfessionConversationFindUniqueOrThrowArgs>(args: SelectSubset<T, ConfessionConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConfessionConversationClient<$Result.GetResult<Prisma.$ConfessionConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConfessionConversation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfessionConversationFindFirstArgs} args - Arguments to find a ConfessionConversation
     * @example
     * // Get one ConfessionConversation
     * const confessionConversation = await prisma.confessionConversation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConfessionConversationFindFirstArgs>(args?: SelectSubset<T, ConfessionConversationFindFirstArgs<ExtArgs>>): Prisma__ConfessionConversationClient<$Result.GetResult<Prisma.$ConfessionConversationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConfessionConversation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfessionConversationFindFirstOrThrowArgs} args - Arguments to find a ConfessionConversation
     * @example
     * // Get one ConfessionConversation
     * const confessionConversation = await prisma.confessionConversation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConfessionConversationFindFirstOrThrowArgs>(args?: SelectSubset<T, ConfessionConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConfessionConversationClient<$Result.GetResult<Prisma.$ConfessionConversationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ConfessionConversations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfessionConversationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConfessionConversations
     * const confessionConversations = await prisma.confessionConversation.findMany()
     * 
     * // Get first 10 ConfessionConversations
     * const confessionConversations = await prisma.confessionConversation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const confessionConversationWithIdOnly = await prisma.confessionConversation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConfessionConversationFindManyArgs>(args?: SelectSubset<T, ConfessionConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfessionConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ConfessionConversation.
     * @param {ConfessionConversationCreateArgs} args - Arguments to create a ConfessionConversation.
     * @example
     * // Create one ConfessionConversation
     * const ConfessionConversation = await prisma.confessionConversation.create({
     *   data: {
     *     // ... data to create a ConfessionConversation
     *   }
     * })
     * 
     */
    create<T extends ConfessionConversationCreateArgs>(args: SelectSubset<T, ConfessionConversationCreateArgs<ExtArgs>>): Prisma__ConfessionConversationClient<$Result.GetResult<Prisma.$ConfessionConversationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ConfessionConversations.
     * @param {ConfessionConversationCreateManyArgs} args - Arguments to create many ConfessionConversations.
     * @example
     * // Create many ConfessionConversations
     * const confessionConversation = await prisma.confessionConversation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConfessionConversationCreateManyArgs>(args?: SelectSubset<T, ConfessionConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConfessionConversations and returns the data saved in the database.
     * @param {ConfessionConversationCreateManyAndReturnArgs} args - Arguments to create many ConfessionConversations.
     * @example
     * // Create many ConfessionConversations
     * const confessionConversation = await prisma.confessionConversation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConfessionConversations and only return the `id`
     * const confessionConversationWithIdOnly = await prisma.confessionConversation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConfessionConversationCreateManyAndReturnArgs>(args?: SelectSubset<T, ConfessionConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfessionConversationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ConfessionConversation.
     * @param {ConfessionConversationDeleteArgs} args - Arguments to delete one ConfessionConversation.
     * @example
     * // Delete one ConfessionConversation
     * const ConfessionConversation = await prisma.confessionConversation.delete({
     *   where: {
     *     // ... filter to delete one ConfessionConversation
     *   }
     * })
     * 
     */
    delete<T extends ConfessionConversationDeleteArgs>(args: SelectSubset<T, ConfessionConversationDeleteArgs<ExtArgs>>): Prisma__ConfessionConversationClient<$Result.GetResult<Prisma.$ConfessionConversationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ConfessionConversation.
     * @param {ConfessionConversationUpdateArgs} args - Arguments to update one ConfessionConversation.
     * @example
     * // Update one ConfessionConversation
     * const confessionConversation = await prisma.confessionConversation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConfessionConversationUpdateArgs>(args: SelectSubset<T, ConfessionConversationUpdateArgs<ExtArgs>>): Prisma__ConfessionConversationClient<$Result.GetResult<Prisma.$ConfessionConversationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ConfessionConversations.
     * @param {ConfessionConversationDeleteManyArgs} args - Arguments to filter ConfessionConversations to delete.
     * @example
     * // Delete a few ConfessionConversations
     * const { count } = await prisma.confessionConversation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConfessionConversationDeleteManyArgs>(args?: SelectSubset<T, ConfessionConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConfessionConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfessionConversationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConfessionConversations
     * const confessionConversation = await prisma.confessionConversation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConfessionConversationUpdateManyArgs>(args: SelectSubset<T, ConfessionConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConfessionConversations and returns the data updated in the database.
     * @param {ConfessionConversationUpdateManyAndReturnArgs} args - Arguments to update many ConfessionConversations.
     * @example
     * // Update many ConfessionConversations
     * const confessionConversation = await prisma.confessionConversation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ConfessionConversations and only return the `id`
     * const confessionConversationWithIdOnly = await prisma.confessionConversation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConfessionConversationUpdateManyAndReturnArgs>(args: SelectSubset<T, ConfessionConversationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfessionConversationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ConfessionConversation.
     * @param {ConfessionConversationUpsertArgs} args - Arguments to update or create a ConfessionConversation.
     * @example
     * // Update or create a ConfessionConversation
     * const confessionConversation = await prisma.confessionConversation.upsert({
     *   create: {
     *     // ... data to create a ConfessionConversation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConfessionConversation we want to update
     *   }
     * })
     */
    upsert<T extends ConfessionConversationUpsertArgs>(args: SelectSubset<T, ConfessionConversationUpsertArgs<ExtArgs>>): Prisma__ConfessionConversationClient<$Result.GetResult<Prisma.$ConfessionConversationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ConfessionConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfessionConversationCountArgs} args - Arguments to filter ConfessionConversations to count.
     * @example
     * // Count the number of ConfessionConversations
     * const count = await prisma.confessionConversation.count({
     *   where: {
     *     // ... the filter for the ConfessionConversations we want to count
     *   }
     * })
    **/
    count<T extends ConfessionConversationCountArgs>(
      args?: Subset<T, ConfessionConversationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConfessionConversationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConfessionConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfessionConversationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConfessionConversationAggregateArgs>(args: Subset<T, ConfessionConversationAggregateArgs>): Prisma.PrismaPromise<GetConfessionConversationAggregateType<T>>

    /**
     * Group by ConfessionConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfessionConversationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConfessionConversationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConfessionConversationGroupByArgs['orderBy'] }
        : { orderBy?: ConfessionConversationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConfessionConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConfessionConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConfessionConversation model
   */
  readonly fields: ConfessionConversationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConfessionConversation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConfessionConversationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    messages<T extends ConfessionConversation$messagesArgs<ExtArgs> = {}>(args?: Subset<T, ConfessionConversation$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfessionMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ConfessionConversation model
   */
  interface ConfessionConversationFieldRefs {
    readonly id: FieldRef<"ConfessionConversation", 'String'>
    readonly userId: FieldRef<"ConfessionConversation", 'String'>
    readonly title: FieldRef<"ConfessionConversation", 'String'>
    readonly createdAt: FieldRef<"ConfessionConversation", 'DateTime'>
    readonly updatedAt: FieldRef<"ConfessionConversation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConfessionConversation findUnique
   */
  export type ConfessionConversationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionConversation
     */
    select?: ConfessionConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionConversation
     */
    omit?: ConfessionConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionConversationInclude<ExtArgs> | null
    /**
     * Filter, which ConfessionConversation to fetch.
     */
    where: ConfessionConversationWhereUniqueInput
  }

  /**
   * ConfessionConversation findUniqueOrThrow
   */
  export type ConfessionConversationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionConversation
     */
    select?: ConfessionConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionConversation
     */
    omit?: ConfessionConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionConversationInclude<ExtArgs> | null
    /**
     * Filter, which ConfessionConversation to fetch.
     */
    where: ConfessionConversationWhereUniqueInput
  }

  /**
   * ConfessionConversation findFirst
   */
  export type ConfessionConversationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionConversation
     */
    select?: ConfessionConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionConversation
     */
    omit?: ConfessionConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionConversationInclude<ExtArgs> | null
    /**
     * Filter, which ConfessionConversation to fetch.
     */
    where?: ConfessionConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfessionConversations to fetch.
     */
    orderBy?: ConfessionConversationOrderByWithRelationInput | ConfessionConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConfessionConversations.
     */
    cursor?: ConfessionConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfessionConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfessionConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConfessionConversations.
     */
    distinct?: ConfessionConversationScalarFieldEnum | ConfessionConversationScalarFieldEnum[]
  }

  /**
   * ConfessionConversation findFirstOrThrow
   */
  export type ConfessionConversationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionConversation
     */
    select?: ConfessionConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionConversation
     */
    omit?: ConfessionConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionConversationInclude<ExtArgs> | null
    /**
     * Filter, which ConfessionConversation to fetch.
     */
    where?: ConfessionConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfessionConversations to fetch.
     */
    orderBy?: ConfessionConversationOrderByWithRelationInput | ConfessionConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConfessionConversations.
     */
    cursor?: ConfessionConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfessionConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfessionConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConfessionConversations.
     */
    distinct?: ConfessionConversationScalarFieldEnum | ConfessionConversationScalarFieldEnum[]
  }

  /**
   * ConfessionConversation findMany
   */
  export type ConfessionConversationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionConversation
     */
    select?: ConfessionConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionConversation
     */
    omit?: ConfessionConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionConversationInclude<ExtArgs> | null
    /**
     * Filter, which ConfessionConversations to fetch.
     */
    where?: ConfessionConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfessionConversations to fetch.
     */
    orderBy?: ConfessionConversationOrderByWithRelationInput | ConfessionConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConfessionConversations.
     */
    cursor?: ConfessionConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfessionConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfessionConversations.
     */
    skip?: number
    distinct?: ConfessionConversationScalarFieldEnum | ConfessionConversationScalarFieldEnum[]
  }

  /**
   * ConfessionConversation create
   */
  export type ConfessionConversationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionConversation
     */
    select?: ConfessionConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionConversation
     */
    omit?: ConfessionConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionConversationInclude<ExtArgs> | null
    /**
     * The data needed to create a ConfessionConversation.
     */
    data: XOR<ConfessionConversationCreateInput, ConfessionConversationUncheckedCreateInput>
  }

  /**
   * ConfessionConversation createMany
   */
  export type ConfessionConversationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConfessionConversations.
     */
    data: ConfessionConversationCreateManyInput | ConfessionConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConfessionConversation createManyAndReturn
   */
  export type ConfessionConversationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionConversation
     */
    select?: ConfessionConversationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionConversation
     */
    omit?: ConfessionConversationOmit<ExtArgs> | null
    /**
     * The data used to create many ConfessionConversations.
     */
    data: ConfessionConversationCreateManyInput | ConfessionConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConfessionConversation update
   */
  export type ConfessionConversationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionConversation
     */
    select?: ConfessionConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionConversation
     */
    omit?: ConfessionConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionConversationInclude<ExtArgs> | null
    /**
     * The data needed to update a ConfessionConversation.
     */
    data: XOR<ConfessionConversationUpdateInput, ConfessionConversationUncheckedUpdateInput>
    /**
     * Choose, which ConfessionConversation to update.
     */
    where: ConfessionConversationWhereUniqueInput
  }

  /**
   * ConfessionConversation updateMany
   */
  export type ConfessionConversationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConfessionConversations.
     */
    data: XOR<ConfessionConversationUpdateManyMutationInput, ConfessionConversationUncheckedUpdateManyInput>
    /**
     * Filter which ConfessionConversations to update
     */
    where?: ConfessionConversationWhereInput
    /**
     * Limit how many ConfessionConversations to update.
     */
    limit?: number
  }

  /**
   * ConfessionConversation updateManyAndReturn
   */
  export type ConfessionConversationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionConversation
     */
    select?: ConfessionConversationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionConversation
     */
    omit?: ConfessionConversationOmit<ExtArgs> | null
    /**
     * The data used to update ConfessionConversations.
     */
    data: XOR<ConfessionConversationUpdateManyMutationInput, ConfessionConversationUncheckedUpdateManyInput>
    /**
     * Filter which ConfessionConversations to update
     */
    where?: ConfessionConversationWhereInput
    /**
     * Limit how many ConfessionConversations to update.
     */
    limit?: number
  }

  /**
   * ConfessionConversation upsert
   */
  export type ConfessionConversationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionConversation
     */
    select?: ConfessionConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionConversation
     */
    omit?: ConfessionConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionConversationInclude<ExtArgs> | null
    /**
     * The filter to search for the ConfessionConversation to update in case it exists.
     */
    where: ConfessionConversationWhereUniqueInput
    /**
     * In case the ConfessionConversation found by the `where` argument doesn't exist, create a new ConfessionConversation with this data.
     */
    create: XOR<ConfessionConversationCreateInput, ConfessionConversationUncheckedCreateInput>
    /**
     * In case the ConfessionConversation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConfessionConversationUpdateInput, ConfessionConversationUncheckedUpdateInput>
  }

  /**
   * ConfessionConversation delete
   */
  export type ConfessionConversationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionConversation
     */
    select?: ConfessionConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionConversation
     */
    omit?: ConfessionConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionConversationInclude<ExtArgs> | null
    /**
     * Filter which ConfessionConversation to delete.
     */
    where: ConfessionConversationWhereUniqueInput
  }

  /**
   * ConfessionConversation deleteMany
   */
  export type ConfessionConversationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConfessionConversations to delete
     */
    where?: ConfessionConversationWhereInput
    /**
     * Limit how many ConfessionConversations to delete.
     */
    limit?: number
  }

  /**
   * ConfessionConversation.messages
   */
  export type ConfessionConversation$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionMessage
     */
    select?: ConfessionMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionMessage
     */
    omit?: ConfessionMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionMessageInclude<ExtArgs> | null
    where?: ConfessionMessageWhereInput
    orderBy?: ConfessionMessageOrderByWithRelationInput | ConfessionMessageOrderByWithRelationInput[]
    cursor?: ConfessionMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConfessionMessageScalarFieldEnum | ConfessionMessageScalarFieldEnum[]
  }

  /**
   * ConfessionConversation without action
   */
  export type ConfessionConversationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionConversation
     */
    select?: ConfessionConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionConversation
     */
    omit?: ConfessionConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionConversationInclude<ExtArgs> | null
  }


  /**
   * Model ConfessionMessage
   */

  export type AggregateConfessionMessage = {
    _count: ConfessionMessageCountAggregateOutputType | null
    _min: ConfessionMessageMinAggregateOutputType | null
    _max: ConfessionMessageMaxAggregateOutputType | null
  }

  export type ConfessionMessageMinAggregateOutputType = {
    id: string | null
    conversationId: string | null
    role: string | null
    text: string | null
    createdAt: Date | null
  }

  export type ConfessionMessageMaxAggregateOutputType = {
    id: string | null
    conversationId: string | null
    role: string | null
    text: string | null
    createdAt: Date | null
  }

  export type ConfessionMessageCountAggregateOutputType = {
    id: number
    conversationId: number
    role: number
    text: number
    createdAt: number
    _all: number
  }


  export type ConfessionMessageMinAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    text?: true
    createdAt?: true
  }

  export type ConfessionMessageMaxAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    text?: true
    createdAt?: true
  }

  export type ConfessionMessageCountAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    text?: true
    createdAt?: true
    _all?: true
  }

  export type ConfessionMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConfessionMessage to aggregate.
     */
    where?: ConfessionMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfessionMessages to fetch.
     */
    orderBy?: ConfessionMessageOrderByWithRelationInput | ConfessionMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConfessionMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfessionMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfessionMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConfessionMessages
    **/
    _count?: true | ConfessionMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConfessionMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConfessionMessageMaxAggregateInputType
  }

  export type GetConfessionMessageAggregateType<T extends ConfessionMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateConfessionMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConfessionMessage[P]>
      : GetScalarType<T[P], AggregateConfessionMessage[P]>
  }




  export type ConfessionMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConfessionMessageWhereInput
    orderBy?: ConfessionMessageOrderByWithAggregationInput | ConfessionMessageOrderByWithAggregationInput[]
    by: ConfessionMessageScalarFieldEnum[] | ConfessionMessageScalarFieldEnum
    having?: ConfessionMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConfessionMessageCountAggregateInputType | true
    _min?: ConfessionMessageMinAggregateInputType
    _max?: ConfessionMessageMaxAggregateInputType
  }

  export type ConfessionMessageGroupByOutputType = {
    id: string
    conversationId: string
    role: string
    text: string
    createdAt: Date
    _count: ConfessionMessageCountAggregateOutputType | null
    _min: ConfessionMessageMinAggregateOutputType | null
    _max: ConfessionMessageMaxAggregateOutputType | null
  }

  type GetConfessionMessageGroupByPayload<T extends ConfessionMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConfessionMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConfessionMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConfessionMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ConfessionMessageGroupByOutputType[P]>
        }
      >
    >


  export type ConfessionMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    text?: boolean
    createdAt?: boolean
    conversation?: boolean | ConfessionConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["confessionMessage"]>

  export type ConfessionMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    text?: boolean
    createdAt?: boolean
    conversation?: boolean | ConfessionConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["confessionMessage"]>

  export type ConfessionMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    text?: boolean
    createdAt?: boolean
    conversation?: boolean | ConfessionConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["confessionMessage"]>

  export type ConfessionMessageSelectScalar = {
    id?: boolean
    conversationId?: boolean
    role?: boolean
    text?: boolean
    createdAt?: boolean
  }

  export type ConfessionMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "conversationId" | "role" | "text" | "createdAt", ExtArgs["result"]["confessionMessage"]>
  export type ConfessionMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConfessionConversationDefaultArgs<ExtArgs>
  }
  export type ConfessionMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConfessionConversationDefaultArgs<ExtArgs>
  }
  export type ConfessionMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConfessionConversationDefaultArgs<ExtArgs>
  }

  export type $ConfessionMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConfessionMessage"
    objects: {
      conversation: Prisma.$ConfessionConversationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conversationId: string
      role: string
      text: string
      createdAt: Date
    }, ExtArgs["result"]["confessionMessage"]>
    composites: {}
  }

  type ConfessionMessageGetPayload<S extends boolean | null | undefined | ConfessionMessageDefaultArgs> = $Result.GetResult<Prisma.$ConfessionMessagePayload, S>

  type ConfessionMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConfessionMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConfessionMessageCountAggregateInputType | true
    }

  export interface ConfessionMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConfessionMessage'], meta: { name: 'ConfessionMessage' } }
    /**
     * Find zero or one ConfessionMessage that matches the filter.
     * @param {ConfessionMessageFindUniqueArgs} args - Arguments to find a ConfessionMessage
     * @example
     * // Get one ConfessionMessage
     * const confessionMessage = await prisma.confessionMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConfessionMessageFindUniqueArgs>(args: SelectSubset<T, ConfessionMessageFindUniqueArgs<ExtArgs>>): Prisma__ConfessionMessageClient<$Result.GetResult<Prisma.$ConfessionMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ConfessionMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConfessionMessageFindUniqueOrThrowArgs} args - Arguments to find a ConfessionMessage
     * @example
     * // Get one ConfessionMessage
     * const confessionMessage = await prisma.confessionMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConfessionMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ConfessionMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConfessionMessageClient<$Result.GetResult<Prisma.$ConfessionMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConfessionMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfessionMessageFindFirstArgs} args - Arguments to find a ConfessionMessage
     * @example
     * // Get one ConfessionMessage
     * const confessionMessage = await prisma.confessionMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConfessionMessageFindFirstArgs>(args?: SelectSubset<T, ConfessionMessageFindFirstArgs<ExtArgs>>): Prisma__ConfessionMessageClient<$Result.GetResult<Prisma.$ConfessionMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConfessionMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfessionMessageFindFirstOrThrowArgs} args - Arguments to find a ConfessionMessage
     * @example
     * // Get one ConfessionMessage
     * const confessionMessage = await prisma.confessionMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConfessionMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ConfessionMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConfessionMessageClient<$Result.GetResult<Prisma.$ConfessionMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ConfessionMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfessionMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConfessionMessages
     * const confessionMessages = await prisma.confessionMessage.findMany()
     * 
     * // Get first 10 ConfessionMessages
     * const confessionMessages = await prisma.confessionMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const confessionMessageWithIdOnly = await prisma.confessionMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConfessionMessageFindManyArgs>(args?: SelectSubset<T, ConfessionMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfessionMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ConfessionMessage.
     * @param {ConfessionMessageCreateArgs} args - Arguments to create a ConfessionMessage.
     * @example
     * // Create one ConfessionMessage
     * const ConfessionMessage = await prisma.confessionMessage.create({
     *   data: {
     *     // ... data to create a ConfessionMessage
     *   }
     * })
     * 
     */
    create<T extends ConfessionMessageCreateArgs>(args: SelectSubset<T, ConfessionMessageCreateArgs<ExtArgs>>): Prisma__ConfessionMessageClient<$Result.GetResult<Prisma.$ConfessionMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ConfessionMessages.
     * @param {ConfessionMessageCreateManyArgs} args - Arguments to create many ConfessionMessages.
     * @example
     * // Create many ConfessionMessages
     * const confessionMessage = await prisma.confessionMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConfessionMessageCreateManyArgs>(args?: SelectSubset<T, ConfessionMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConfessionMessages and returns the data saved in the database.
     * @param {ConfessionMessageCreateManyAndReturnArgs} args - Arguments to create many ConfessionMessages.
     * @example
     * // Create many ConfessionMessages
     * const confessionMessage = await prisma.confessionMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConfessionMessages and only return the `id`
     * const confessionMessageWithIdOnly = await prisma.confessionMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConfessionMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ConfessionMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfessionMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ConfessionMessage.
     * @param {ConfessionMessageDeleteArgs} args - Arguments to delete one ConfessionMessage.
     * @example
     * // Delete one ConfessionMessage
     * const ConfessionMessage = await prisma.confessionMessage.delete({
     *   where: {
     *     // ... filter to delete one ConfessionMessage
     *   }
     * })
     * 
     */
    delete<T extends ConfessionMessageDeleteArgs>(args: SelectSubset<T, ConfessionMessageDeleteArgs<ExtArgs>>): Prisma__ConfessionMessageClient<$Result.GetResult<Prisma.$ConfessionMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ConfessionMessage.
     * @param {ConfessionMessageUpdateArgs} args - Arguments to update one ConfessionMessage.
     * @example
     * // Update one ConfessionMessage
     * const confessionMessage = await prisma.confessionMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConfessionMessageUpdateArgs>(args: SelectSubset<T, ConfessionMessageUpdateArgs<ExtArgs>>): Prisma__ConfessionMessageClient<$Result.GetResult<Prisma.$ConfessionMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ConfessionMessages.
     * @param {ConfessionMessageDeleteManyArgs} args - Arguments to filter ConfessionMessages to delete.
     * @example
     * // Delete a few ConfessionMessages
     * const { count } = await prisma.confessionMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConfessionMessageDeleteManyArgs>(args?: SelectSubset<T, ConfessionMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConfessionMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfessionMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConfessionMessages
     * const confessionMessage = await prisma.confessionMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConfessionMessageUpdateManyArgs>(args: SelectSubset<T, ConfessionMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConfessionMessages and returns the data updated in the database.
     * @param {ConfessionMessageUpdateManyAndReturnArgs} args - Arguments to update many ConfessionMessages.
     * @example
     * // Update many ConfessionMessages
     * const confessionMessage = await prisma.confessionMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ConfessionMessages and only return the `id`
     * const confessionMessageWithIdOnly = await prisma.confessionMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConfessionMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, ConfessionMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfessionMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ConfessionMessage.
     * @param {ConfessionMessageUpsertArgs} args - Arguments to update or create a ConfessionMessage.
     * @example
     * // Update or create a ConfessionMessage
     * const confessionMessage = await prisma.confessionMessage.upsert({
     *   create: {
     *     // ... data to create a ConfessionMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConfessionMessage we want to update
     *   }
     * })
     */
    upsert<T extends ConfessionMessageUpsertArgs>(args: SelectSubset<T, ConfessionMessageUpsertArgs<ExtArgs>>): Prisma__ConfessionMessageClient<$Result.GetResult<Prisma.$ConfessionMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ConfessionMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfessionMessageCountArgs} args - Arguments to filter ConfessionMessages to count.
     * @example
     * // Count the number of ConfessionMessages
     * const count = await prisma.confessionMessage.count({
     *   where: {
     *     // ... the filter for the ConfessionMessages we want to count
     *   }
     * })
    **/
    count<T extends ConfessionMessageCountArgs>(
      args?: Subset<T, ConfessionMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConfessionMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConfessionMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfessionMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConfessionMessageAggregateArgs>(args: Subset<T, ConfessionMessageAggregateArgs>): Prisma.PrismaPromise<GetConfessionMessageAggregateType<T>>

    /**
     * Group by ConfessionMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfessionMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConfessionMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConfessionMessageGroupByArgs['orderBy'] }
        : { orderBy?: ConfessionMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConfessionMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConfessionMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConfessionMessage model
   */
  readonly fields: ConfessionMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConfessionMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConfessionMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    conversation<T extends ConfessionConversationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConfessionConversationDefaultArgs<ExtArgs>>): Prisma__ConfessionConversationClient<$Result.GetResult<Prisma.$ConfessionConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ConfessionMessage model
   */
  interface ConfessionMessageFieldRefs {
    readonly id: FieldRef<"ConfessionMessage", 'String'>
    readonly conversationId: FieldRef<"ConfessionMessage", 'String'>
    readonly role: FieldRef<"ConfessionMessage", 'String'>
    readonly text: FieldRef<"ConfessionMessage", 'String'>
    readonly createdAt: FieldRef<"ConfessionMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConfessionMessage findUnique
   */
  export type ConfessionMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionMessage
     */
    select?: ConfessionMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionMessage
     */
    omit?: ConfessionMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionMessageInclude<ExtArgs> | null
    /**
     * Filter, which ConfessionMessage to fetch.
     */
    where: ConfessionMessageWhereUniqueInput
  }

  /**
   * ConfessionMessage findUniqueOrThrow
   */
  export type ConfessionMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionMessage
     */
    select?: ConfessionMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionMessage
     */
    omit?: ConfessionMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionMessageInclude<ExtArgs> | null
    /**
     * Filter, which ConfessionMessage to fetch.
     */
    where: ConfessionMessageWhereUniqueInput
  }

  /**
   * ConfessionMessage findFirst
   */
  export type ConfessionMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionMessage
     */
    select?: ConfessionMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionMessage
     */
    omit?: ConfessionMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionMessageInclude<ExtArgs> | null
    /**
     * Filter, which ConfessionMessage to fetch.
     */
    where?: ConfessionMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfessionMessages to fetch.
     */
    orderBy?: ConfessionMessageOrderByWithRelationInput | ConfessionMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConfessionMessages.
     */
    cursor?: ConfessionMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfessionMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfessionMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConfessionMessages.
     */
    distinct?: ConfessionMessageScalarFieldEnum | ConfessionMessageScalarFieldEnum[]
  }

  /**
   * ConfessionMessage findFirstOrThrow
   */
  export type ConfessionMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionMessage
     */
    select?: ConfessionMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionMessage
     */
    omit?: ConfessionMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionMessageInclude<ExtArgs> | null
    /**
     * Filter, which ConfessionMessage to fetch.
     */
    where?: ConfessionMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfessionMessages to fetch.
     */
    orderBy?: ConfessionMessageOrderByWithRelationInput | ConfessionMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConfessionMessages.
     */
    cursor?: ConfessionMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfessionMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfessionMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConfessionMessages.
     */
    distinct?: ConfessionMessageScalarFieldEnum | ConfessionMessageScalarFieldEnum[]
  }

  /**
   * ConfessionMessage findMany
   */
  export type ConfessionMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionMessage
     */
    select?: ConfessionMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionMessage
     */
    omit?: ConfessionMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionMessageInclude<ExtArgs> | null
    /**
     * Filter, which ConfessionMessages to fetch.
     */
    where?: ConfessionMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfessionMessages to fetch.
     */
    orderBy?: ConfessionMessageOrderByWithRelationInput | ConfessionMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConfessionMessages.
     */
    cursor?: ConfessionMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfessionMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfessionMessages.
     */
    skip?: number
    distinct?: ConfessionMessageScalarFieldEnum | ConfessionMessageScalarFieldEnum[]
  }

  /**
   * ConfessionMessage create
   */
  export type ConfessionMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionMessage
     */
    select?: ConfessionMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionMessage
     */
    omit?: ConfessionMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a ConfessionMessage.
     */
    data: XOR<ConfessionMessageCreateInput, ConfessionMessageUncheckedCreateInput>
  }

  /**
   * ConfessionMessage createMany
   */
  export type ConfessionMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConfessionMessages.
     */
    data: ConfessionMessageCreateManyInput | ConfessionMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConfessionMessage createManyAndReturn
   */
  export type ConfessionMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionMessage
     */
    select?: ConfessionMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionMessage
     */
    omit?: ConfessionMessageOmit<ExtArgs> | null
    /**
     * The data used to create many ConfessionMessages.
     */
    data: ConfessionMessageCreateManyInput | ConfessionMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConfessionMessage update
   */
  export type ConfessionMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionMessage
     */
    select?: ConfessionMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionMessage
     */
    omit?: ConfessionMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a ConfessionMessage.
     */
    data: XOR<ConfessionMessageUpdateInput, ConfessionMessageUncheckedUpdateInput>
    /**
     * Choose, which ConfessionMessage to update.
     */
    where: ConfessionMessageWhereUniqueInput
  }

  /**
   * ConfessionMessage updateMany
   */
  export type ConfessionMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConfessionMessages.
     */
    data: XOR<ConfessionMessageUpdateManyMutationInput, ConfessionMessageUncheckedUpdateManyInput>
    /**
     * Filter which ConfessionMessages to update
     */
    where?: ConfessionMessageWhereInput
    /**
     * Limit how many ConfessionMessages to update.
     */
    limit?: number
  }

  /**
   * ConfessionMessage updateManyAndReturn
   */
  export type ConfessionMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionMessage
     */
    select?: ConfessionMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionMessage
     */
    omit?: ConfessionMessageOmit<ExtArgs> | null
    /**
     * The data used to update ConfessionMessages.
     */
    data: XOR<ConfessionMessageUpdateManyMutationInput, ConfessionMessageUncheckedUpdateManyInput>
    /**
     * Filter which ConfessionMessages to update
     */
    where?: ConfessionMessageWhereInput
    /**
     * Limit how many ConfessionMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConfessionMessage upsert
   */
  export type ConfessionMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionMessage
     */
    select?: ConfessionMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionMessage
     */
    omit?: ConfessionMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the ConfessionMessage to update in case it exists.
     */
    where: ConfessionMessageWhereUniqueInput
    /**
     * In case the ConfessionMessage found by the `where` argument doesn't exist, create a new ConfessionMessage with this data.
     */
    create: XOR<ConfessionMessageCreateInput, ConfessionMessageUncheckedCreateInput>
    /**
     * In case the ConfessionMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConfessionMessageUpdateInput, ConfessionMessageUncheckedUpdateInput>
  }

  /**
   * ConfessionMessage delete
   */
  export type ConfessionMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionMessage
     */
    select?: ConfessionMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionMessage
     */
    omit?: ConfessionMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionMessageInclude<ExtArgs> | null
    /**
     * Filter which ConfessionMessage to delete.
     */
    where: ConfessionMessageWhereUniqueInput
  }

  /**
   * ConfessionMessage deleteMany
   */
  export type ConfessionMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConfessionMessages to delete
     */
    where?: ConfessionMessageWhereInput
    /**
     * Limit how many ConfessionMessages to delete.
     */
    limit?: number
  }

  /**
   * ConfessionMessage without action
   */
  export type ConfessionMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfessionMessage
     */
    select?: ConfessionMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfessionMessage
     */
    omit?: ConfessionMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConfessionMessageInclude<ExtArgs> | null
  }


  /**
   * Model MediaAlbum
   */

  export type AggregateMediaAlbum = {
    _count: MediaAlbumCountAggregateOutputType | null
    _min: MediaAlbumMinAggregateOutputType | null
    _max: MediaAlbumMaxAggregateOutputType | null
  }

  export type MediaAlbumMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MediaAlbumMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MediaAlbumCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MediaAlbumMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MediaAlbumMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MediaAlbumCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MediaAlbumAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MediaAlbum to aggregate.
     */
    where?: MediaAlbumWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaAlbums to fetch.
     */
    orderBy?: MediaAlbumOrderByWithRelationInput | MediaAlbumOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MediaAlbumWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaAlbums from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaAlbums.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MediaAlbums
    **/
    _count?: true | MediaAlbumCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MediaAlbumMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MediaAlbumMaxAggregateInputType
  }

  export type GetMediaAlbumAggregateType<T extends MediaAlbumAggregateArgs> = {
        [P in keyof T & keyof AggregateMediaAlbum]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMediaAlbum[P]>
      : GetScalarType<T[P], AggregateMediaAlbum[P]>
  }




  export type MediaAlbumGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MediaAlbumWhereInput
    orderBy?: MediaAlbumOrderByWithAggregationInput | MediaAlbumOrderByWithAggregationInput[]
    by: MediaAlbumScalarFieldEnum[] | MediaAlbumScalarFieldEnum
    having?: MediaAlbumScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MediaAlbumCountAggregateInputType | true
    _min?: MediaAlbumMinAggregateInputType
    _max?: MediaAlbumMaxAggregateInputType
  }

  export type MediaAlbumGroupByOutputType = {
    id: string
    userId: string
    title: string
    createdAt: Date
    updatedAt: Date
    _count: MediaAlbumCountAggregateOutputType | null
    _min: MediaAlbumMinAggregateOutputType | null
    _max: MediaAlbumMaxAggregateOutputType | null
  }

  type GetMediaAlbumGroupByPayload<T extends MediaAlbumGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MediaAlbumGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MediaAlbumGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MediaAlbumGroupByOutputType[P]>
            : GetScalarType<T[P], MediaAlbumGroupByOutputType[P]>
        }
      >
    >


  export type MediaAlbumSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    assets?: boolean | MediaAlbum$assetsArgs<ExtArgs>
    _count?: boolean | MediaAlbumCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mediaAlbum"]>

  export type MediaAlbumSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mediaAlbum"]>

  export type MediaAlbumSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mediaAlbum"]>

  export type MediaAlbumSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MediaAlbumOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "createdAt" | "updatedAt", ExtArgs["result"]["mediaAlbum"]>
  export type MediaAlbumInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assets?: boolean | MediaAlbum$assetsArgs<ExtArgs>
    _count?: boolean | MediaAlbumCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MediaAlbumIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MediaAlbumIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MediaAlbumPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MediaAlbum"
    objects: {
      assets: Prisma.$MediaAssetPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["mediaAlbum"]>
    composites: {}
  }

  type MediaAlbumGetPayload<S extends boolean | null | undefined | MediaAlbumDefaultArgs> = $Result.GetResult<Prisma.$MediaAlbumPayload, S>

  type MediaAlbumCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MediaAlbumFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MediaAlbumCountAggregateInputType | true
    }

  export interface MediaAlbumDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MediaAlbum'], meta: { name: 'MediaAlbum' } }
    /**
     * Find zero or one MediaAlbum that matches the filter.
     * @param {MediaAlbumFindUniqueArgs} args - Arguments to find a MediaAlbum
     * @example
     * // Get one MediaAlbum
     * const mediaAlbum = await prisma.mediaAlbum.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MediaAlbumFindUniqueArgs>(args: SelectSubset<T, MediaAlbumFindUniqueArgs<ExtArgs>>): Prisma__MediaAlbumClient<$Result.GetResult<Prisma.$MediaAlbumPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MediaAlbum that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MediaAlbumFindUniqueOrThrowArgs} args - Arguments to find a MediaAlbum
     * @example
     * // Get one MediaAlbum
     * const mediaAlbum = await prisma.mediaAlbum.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MediaAlbumFindUniqueOrThrowArgs>(args: SelectSubset<T, MediaAlbumFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MediaAlbumClient<$Result.GetResult<Prisma.$MediaAlbumPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MediaAlbum that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAlbumFindFirstArgs} args - Arguments to find a MediaAlbum
     * @example
     * // Get one MediaAlbum
     * const mediaAlbum = await prisma.mediaAlbum.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MediaAlbumFindFirstArgs>(args?: SelectSubset<T, MediaAlbumFindFirstArgs<ExtArgs>>): Prisma__MediaAlbumClient<$Result.GetResult<Prisma.$MediaAlbumPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MediaAlbum that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAlbumFindFirstOrThrowArgs} args - Arguments to find a MediaAlbum
     * @example
     * // Get one MediaAlbum
     * const mediaAlbum = await prisma.mediaAlbum.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MediaAlbumFindFirstOrThrowArgs>(args?: SelectSubset<T, MediaAlbumFindFirstOrThrowArgs<ExtArgs>>): Prisma__MediaAlbumClient<$Result.GetResult<Prisma.$MediaAlbumPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MediaAlbums that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAlbumFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MediaAlbums
     * const mediaAlbums = await prisma.mediaAlbum.findMany()
     * 
     * // Get first 10 MediaAlbums
     * const mediaAlbums = await prisma.mediaAlbum.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mediaAlbumWithIdOnly = await prisma.mediaAlbum.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MediaAlbumFindManyArgs>(args?: SelectSubset<T, MediaAlbumFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaAlbumPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MediaAlbum.
     * @param {MediaAlbumCreateArgs} args - Arguments to create a MediaAlbum.
     * @example
     * // Create one MediaAlbum
     * const MediaAlbum = await prisma.mediaAlbum.create({
     *   data: {
     *     // ... data to create a MediaAlbum
     *   }
     * })
     * 
     */
    create<T extends MediaAlbumCreateArgs>(args: SelectSubset<T, MediaAlbumCreateArgs<ExtArgs>>): Prisma__MediaAlbumClient<$Result.GetResult<Prisma.$MediaAlbumPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MediaAlbums.
     * @param {MediaAlbumCreateManyArgs} args - Arguments to create many MediaAlbums.
     * @example
     * // Create many MediaAlbums
     * const mediaAlbum = await prisma.mediaAlbum.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MediaAlbumCreateManyArgs>(args?: SelectSubset<T, MediaAlbumCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MediaAlbums and returns the data saved in the database.
     * @param {MediaAlbumCreateManyAndReturnArgs} args - Arguments to create many MediaAlbums.
     * @example
     * // Create many MediaAlbums
     * const mediaAlbum = await prisma.mediaAlbum.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MediaAlbums and only return the `id`
     * const mediaAlbumWithIdOnly = await prisma.mediaAlbum.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MediaAlbumCreateManyAndReturnArgs>(args?: SelectSubset<T, MediaAlbumCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaAlbumPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MediaAlbum.
     * @param {MediaAlbumDeleteArgs} args - Arguments to delete one MediaAlbum.
     * @example
     * // Delete one MediaAlbum
     * const MediaAlbum = await prisma.mediaAlbum.delete({
     *   where: {
     *     // ... filter to delete one MediaAlbum
     *   }
     * })
     * 
     */
    delete<T extends MediaAlbumDeleteArgs>(args: SelectSubset<T, MediaAlbumDeleteArgs<ExtArgs>>): Prisma__MediaAlbumClient<$Result.GetResult<Prisma.$MediaAlbumPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MediaAlbum.
     * @param {MediaAlbumUpdateArgs} args - Arguments to update one MediaAlbum.
     * @example
     * // Update one MediaAlbum
     * const mediaAlbum = await prisma.mediaAlbum.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MediaAlbumUpdateArgs>(args: SelectSubset<T, MediaAlbumUpdateArgs<ExtArgs>>): Prisma__MediaAlbumClient<$Result.GetResult<Prisma.$MediaAlbumPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MediaAlbums.
     * @param {MediaAlbumDeleteManyArgs} args - Arguments to filter MediaAlbums to delete.
     * @example
     * // Delete a few MediaAlbums
     * const { count } = await prisma.mediaAlbum.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MediaAlbumDeleteManyArgs>(args?: SelectSubset<T, MediaAlbumDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MediaAlbums.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAlbumUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MediaAlbums
     * const mediaAlbum = await prisma.mediaAlbum.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MediaAlbumUpdateManyArgs>(args: SelectSubset<T, MediaAlbumUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MediaAlbums and returns the data updated in the database.
     * @param {MediaAlbumUpdateManyAndReturnArgs} args - Arguments to update many MediaAlbums.
     * @example
     * // Update many MediaAlbums
     * const mediaAlbum = await prisma.mediaAlbum.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MediaAlbums and only return the `id`
     * const mediaAlbumWithIdOnly = await prisma.mediaAlbum.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MediaAlbumUpdateManyAndReturnArgs>(args: SelectSubset<T, MediaAlbumUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaAlbumPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MediaAlbum.
     * @param {MediaAlbumUpsertArgs} args - Arguments to update or create a MediaAlbum.
     * @example
     * // Update or create a MediaAlbum
     * const mediaAlbum = await prisma.mediaAlbum.upsert({
     *   create: {
     *     // ... data to create a MediaAlbum
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MediaAlbum we want to update
     *   }
     * })
     */
    upsert<T extends MediaAlbumUpsertArgs>(args: SelectSubset<T, MediaAlbumUpsertArgs<ExtArgs>>): Prisma__MediaAlbumClient<$Result.GetResult<Prisma.$MediaAlbumPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MediaAlbums.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAlbumCountArgs} args - Arguments to filter MediaAlbums to count.
     * @example
     * // Count the number of MediaAlbums
     * const count = await prisma.mediaAlbum.count({
     *   where: {
     *     // ... the filter for the MediaAlbums we want to count
     *   }
     * })
    **/
    count<T extends MediaAlbumCountArgs>(
      args?: Subset<T, MediaAlbumCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MediaAlbumCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MediaAlbum.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAlbumAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MediaAlbumAggregateArgs>(args: Subset<T, MediaAlbumAggregateArgs>): Prisma.PrismaPromise<GetMediaAlbumAggregateType<T>>

    /**
     * Group by MediaAlbum.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAlbumGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MediaAlbumGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MediaAlbumGroupByArgs['orderBy'] }
        : { orderBy?: MediaAlbumGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MediaAlbumGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMediaAlbumGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MediaAlbum model
   */
  readonly fields: MediaAlbumFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MediaAlbum.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MediaAlbumClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assets<T extends MediaAlbum$assetsArgs<ExtArgs> = {}>(args?: Subset<T, MediaAlbum$assetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MediaAlbum model
   */
  interface MediaAlbumFieldRefs {
    readonly id: FieldRef<"MediaAlbum", 'String'>
    readonly userId: FieldRef<"MediaAlbum", 'String'>
    readonly title: FieldRef<"MediaAlbum", 'String'>
    readonly createdAt: FieldRef<"MediaAlbum", 'DateTime'>
    readonly updatedAt: FieldRef<"MediaAlbum", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MediaAlbum findUnique
   */
  export type MediaAlbumFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAlbum
     */
    select?: MediaAlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAlbum
     */
    omit?: MediaAlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAlbumInclude<ExtArgs> | null
    /**
     * Filter, which MediaAlbum to fetch.
     */
    where: MediaAlbumWhereUniqueInput
  }

  /**
   * MediaAlbum findUniqueOrThrow
   */
  export type MediaAlbumFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAlbum
     */
    select?: MediaAlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAlbum
     */
    omit?: MediaAlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAlbumInclude<ExtArgs> | null
    /**
     * Filter, which MediaAlbum to fetch.
     */
    where: MediaAlbumWhereUniqueInput
  }

  /**
   * MediaAlbum findFirst
   */
  export type MediaAlbumFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAlbum
     */
    select?: MediaAlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAlbum
     */
    omit?: MediaAlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAlbumInclude<ExtArgs> | null
    /**
     * Filter, which MediaAlbum to fetch.
     */
    where?: MediaAlbumWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaAlbums to fetch.
     */
    orderBy?: MediaAlbumOrderByWithRelationInput | MediaAlbumOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MediaAlbums.
     */
    cursor?: MediaAlbumWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaAlbums from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaAlbums.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MediaAlbums.
     */
    distinct?: MediaAlbumScalarFieldEnum | MediaAlbumScalarFieldEnum[]
  }

  /**
   * MediaAlbum findFirstOrThrow
   */
  export type MediaAlbumFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAlbum
     */
    select?: MediaAlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAlbum
     */
    omit?: MediaAlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAlbumInclude<ExtArgs> | null
    /**
     * Filter, which MediaAlbum to fetch.
     */
    where?: MediaAlbumWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaAlbums to fetch.
     */
    orderBy?: MediaAlbumOrderByWithRelationInput | MediaAlbumOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MediaAlbums.
     */
    cursor?: MediaAlbumWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaAlbums from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaAlbums.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MediaAlbums.
     */
    distinct?: MediaAlbumScalarFieldEnum | MediaAlbumScalarFieldEnum[]
  }

  /**
   * MediaAlbum findMany
   */
  export type MediaAlbumFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAlbum
     */
    select?: MediaAlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAlbum
     */
    omit?: MediaAlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAlbumInclude<ExtArgs> | null
    /**
     * Filter, which MediaAlbums to fetch.
     */
    where?: MediaAlbumWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaAlbums to fetch.
     */
    orderBy?: MediaAlbumOrderByWithRelationInput | MediaAlbumOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MediaAlbums.
     */
    cursor?: MediaAlbumWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaAlbums from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaAlbums.
     */
    skip?: number
    distinct?: MediaAlbumScalarFieldEnum | MediaAlbumScalarFieldEnum[]
  }

  /**
   * MediaAlbum create
   */
  export type MediaAlbumCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAlbum
     */
    select?: MediaAlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAlbum
     */
    omit?: MediaAlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAlbumInclude<ExtArgs> | null
    /**
     * The data needed to create a MediaAlbum.
     */
    data: XOR<MediaAlbumCreateInput, MediaAlbumUncheckedCreateInput>
  }

  /**
   * MediaAlbum createMany
   */
  export type MediaAlbumCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MediaAlbums.
     */
    data: MediaAlbumCreateManyInput | MediaAlbumCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MediaAlbum createManyAndReturn
   */
  export type MediaAlbumCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAlbum
     */
    select?: MediaAlbumSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAlbum
     */
    omit?: MediaAlbumOmit<ExtArgs> | null
    /**
     * The data used to create many MediaAlbums.
     */
    data: MediaAlbumCreateManyInput | MediaAlbumCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MediaAlbum update
   */
  export type MediaAlbumUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAlbum
     */
    select?: MediaAlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAlbum
     */
    omit?: MediaAlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAlbumInclude<ExtArgs> | null
    /**
     * The data needed to update a MediaAlbum.
     */
    data: XOR<MediaAlbumUpdateInput, MediaAlbumUncheckedUpdateInput>
    /**
     * Choose, which MediaAlbum to update.
     */
    where: MediaAlbumWhereUniqueInput
  }

  /**
   * MediaAlbum updateMany
   */
  export type MediaAlbumUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MediaAlbums.
     */
    data: XOR<MediaAlbumUpdateManyMutationInput, MediaAlbumUncheckedUpdateManyInput>
    /**
     * Filter which MediaAlbums to update
     */
    where?: MediaAlbumWhereInput
    /**
     * Limit how many MediaAlbums to update.
     */
    limit?: number
  }

  /**
   * MediaAlbum updateManyAndReturn
   */
  export type MediaAlbumUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAlbum
     */
    select?: MediaAlbumSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAlbum
     */
    omit?: MediaAlbumOmit<ExtArgs> | null
    /**
     * The data used to update MediaAlbums.
     */
    data: XOR<MediaAlbumUpdateManyMutationInput, MediaAlbumUncheckedUpdateManyInput>
    /**
     * Filter which MediaAlbums to update
     */
    where?: MediaAlbumWhereInput
    /**
     * Limit how many MediaAlbums to update.
     */
    limit?: number
  }

  /**
   * MediaAlbum upsert
   */
  export type MediaAlbumUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAlbum
     */
    select?: MediaAlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAlbum
     */
    omit?: MediaAlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAlbumInclude<ExtArgs> | null
    /**
     * The filter to search for the MediaAlbum to update in case it exists.
     */
    where: MediaAlbumWhereUniqueInput
    /**
     * In case the MediaAlbum found by the `where` argument doesn't exist, create a new MediaAlbum with this data.
     */
    create: XOR<MediaAlbumCreateInput, MediaAlbumUncheckedCreateInput>
    /**
     * In case the MediaAlbum was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MediaAlbumUpdateInput, MediaAlbumUncheckedUpdateInput>
  }

  /**
   * MediaAlbum delete
   */
  export type MediaAlbumDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAlbum
     */
    select?: MediaAlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAlbum
     */
    omit?: MediaAlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAlbumInclude<ExtArgs> | null
    /**
     * Filter which MediaAlbum to delete.
     */
    where: MediaAlbumWhereUniqueInput
  }

  /**
   * MediaAlbum deleteMany
   */
  export type MediaAlbumDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MediaAlbums to delete
     */
    where?: MediaAlbumWhereInput
    /**
     * Limit how many MediaAlbums to delete.
     */
    limit?: number
  }

  /**
   * MediaAlbum.assets
   */
  export type MediaAlbum$assetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAssetInclude<ExtArgs> | null
    where?: MediaAssetWhereInput
    orderBy?: MediaAssetOrderByWithRelationInput | MediaAssetOrderByWithRelationInput[]
    cursor?: MediaAssetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MediaAssetScalarFieldEnum | MediaAssetScalarFieldEnum[]
  }

  /**
   * MediaAlbum without action
   */
  export type MediaAlbumDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAlbum
     */
    select?: MediaAlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAlbum
     */
    omit?: MediaAlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAlbumInclude<ExtArgs> | null
  }


  /**
   * Model MediaAsset
   */

  export type AggregateMediaAsset = {
    _count: MediaAssetCountAggregateOutputType | null
    _avg: MediaAssetAvgAggregateOutputType | null
    _sum: MediaAssetSumAggregateOutputType | null
    _min: MediaAssetMinAggregateOutputType | null
    _max: MediaAssetMaxAggregateOutputType | null
  }

  export type MediaAssetAvgAggregateOutputType = {
    size: number | null
    width: number | null
    height: number | null
  }

  export type MediaAssetSumAggregateOutputType = {
    size: number | null
    width: number | null
    height: number | null
  }

  export type MediaAssetMinAggregateOutputType = {
    id: string | null
    albumId: string | null
    uri: string | null
    mime: string | null
    size: number | null
    width: number | null
    height: number | null
    createdAt: Date | null
  }

  export type MediaAssetMaxAggregateOutputType = {
    id: string | null
    albumId: string | null
    uri: string | null
    mime: string | null
    size: number | null
    width: number | null
    height: number | null
    createdAt: Date | null
  }

  export type MediaAssetCountAggregateOutputType = {
    id: number
    albumId: number
    uri: number
    mime: number
    size: number
    width: number
    height: number
    createdAt: number
    _all: number
  }


  export type MediaAssetAvgAggregateInputType = {
    size?: true
    width?: true
    height?: true
  }

  export type MediaAssetSumAggregateInputType = {
    size?: true
    width?: true
    height?: true
  }

  export type MediaAssetMinAggregateInputType = {
    id?: true
    albumId?: true
    uri?: true
    mime?: true
    size?: true
    width?: true
    height?: true
    createdAt?: true
  }

  export type MediaAssetMaxAggregateInputType = {
    id?: true
    albumId?: true
    uri?: true
    mime?: true
    size?: true
    width?: true
    height?: true
    createdAt?: true
  }

  export type MediaAssetCountAggregateInputType = {
    id?: true
    albumId?: true
    uri?: true
    mime?: true
    size?: true
    width?: true
    height?: true
    createdAt?: true
    _all?: true
  }

  export type MediaAssetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MediaAsset to aggregate.
     */
    where?: MediaAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaAssets to fetch.
     */
    orderBy?: MediaAssetOrderByWithRelationInput | MediaAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MediaAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MediaAssets
    **/
    _count?: true | MediaAssetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MediaAssetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MediaAssetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MediaAssetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MediaAssetMaxAggregateInputType
  }

  export type GetMediaAssetAggregateType<T extends MediaAssetAggregateArgs> = {
        [P in keyof T & keyof AggregateMediaAsset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMediaAsset[P]>
      : GetScalarType<T[P], AggregateMediaAsset[P]>
  }




  export type MediaAssetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MediaAssetWhereInput
    orderBy?: MediaAssetOrderByWithAggregationInput | MediaAssetOrderByWithAggregationInput[]
    by: MediaAssetScalarFieldEnum[] | MediaAssetScalarFieldEnum
    having?: MediaAssetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MediaAssetCountAggregateInputType | true
    _avg?: MediaAssetAvgAggregateInputType
    _sum?: MediaAssetSumAggregateInputType
    _min?: MediaAssetMinAggregateInputType
    _max?: MediaAssetMaxAggregateInputType
  }

  export type MediaAssetGroupByOutputType = {
    id: string
    albumId: string
    uri: string
    mime: string | null
    size: number | null
    width: number | null
    height: number | null
    createdAt: Date
    _count: MediaAssetCountAggregateOutputType | null
    _avg: MediaAssetAvgAggregateOutputType | null
    _sum: MediaAssetSumAggregateOutputType | null
    _min: MediaAssetMinAggregateOutputType | null
    _max: MediaAssetMaxAggregateOutputType | null
  }

  type GetMediaAssetGroupByPayload<T extends MediaAssetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MediaAssetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MediaAssetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MediaAssetGroupByOutputType[P]>
            : GetScalarType<T[P], MediaAssetGroupByOutputType[P]>
        }
      >
    >


  export type MediaAssetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    albumId?: boolean
    uri?: boolean
    mime?: boolean
    size?: boolean
    width?: boolean
    height?: boolean
    createdAt?: boolean
    album?: boolean | MediaAlbumDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mediaAsset"]>

  export type MediaAssetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    albumId?: boolean
    uri?: boolean
    mime?: boolean
    size?: boolean
    width?: boolean
    height?: boolean
    createdAt?: boolean
    album?: boolean | MediaAlbumDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mediaAsset"]>

  export type MediaAssetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    albumId?: boolean
    uri?: boolean
    mime?: boolean
    size?: boolean
    width?: boolean
    height?: boolean
    createdAt?: boolean
    album?: boolean | MediaAlbumDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mediaAsset"]>

  export type MediaAssetSelectScalar = {
    id?: boolean
    albumId?: boolean
    uri?: boolean
    mime?: boolean
    size?: boolean
    width?: boolean
    height?: boolean
    createdAt?: boolean
  }

  export type MediaAssetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "albumId" | "uri" | "mime" | "size" | "width" | "height" | "createdAt", ExtArgs["result"]["mediaAsset"]>
  export type MediaAssetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    album?: boolean | MediaAlbumDefaultArgs<ExtArgs>
  }
  export type MediaAssetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    album?: boolean | MediaAlbumDefaultArgs<ExtArgs>
  }
  export type MediaAssetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    album?: boolean | MediaAlbumDefaultArgs<ExtArgs>
  }

  export type $MediaAssetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MediaAsset"
    objects: {
      album: Prisma.$MediaAlbumPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      albumId: string
      uri: string
      mime: string | null
      size: number | null
      width: number | null
      height: number | null
      createdAt: Date
    }, ExtArgs["result"]["mediaAsset"]>
    composites: {}
  }

  type MediaAssetGetPayload<S extends boolean | null | undefined | MediaAssetDefaultArgs> = $Result.GetResult<Prisma.$MediaAssetPayload, S>

  type MediaAssetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MediaAssetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MediaAssetCountAggregateInputType | true
    }

  export interface MediaAssetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MediaAsset'], meta: { name: 'MediaAsset' } }
    /**
     * Find zero or one MediaAsset that matches the filter.
     * @param {MediaAssetFindUniqueArgs} args - Arguments to find a MediaAsset
     * @example
     * // Get one MediaAsset
     * const mediaAsset = await prisma.mediaAsset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MediaAssetFindUniqueArgs>(args: SelectSubset<T, MediaAssetFindUniqueArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MediaAsset that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MediaAssetFindUniqueOrThrowArgs} args - Arguments to find a MediaAsset
     * @example
     * // Get one MediaAsset
     * const mediaAsset = await prisma.mediaAsset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MediaAssetFindUniqueOrThrowArgs>(args: SelectSubset<T, MediaAssetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MediaAsset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAssetFindFirstArgs} args - Arguments to find a MediaAsset
     * @example
     * // Get one MediaAsset
     * const mediaAsset = await prisma.mediaAsset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MediaAssetFindFirstArgs>(args?: SelectSubset<T, MediaAssetFindFirstArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MediaAsset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAssetFindFirstOrThrowArgs} args - Arguments to find a MediaAsset
     * @example
     * // Get one MediaAsset
     * const mediaAsset = await prisma.mediaAsset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MediaAssetFindFirstOrThrowArgs>(args?: SelectSubset<T, MediaAssetFindFirstOrThrowArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MediaAssets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAssetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MediaAssets
     * const mediaAssets = await prisma.mediaAsset.findMany()
     * 
     * // Get first 10 MediaAssets
     * const mediaAssets = await prisma.mediaAsset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mediaAssetWithIdOnly = await prisma.mediaAsset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MediaAssetFindManyArgs>(args?: SelectSubset<T, MediaAssetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MediaAsset.
     * @param {MediaAssetCreateArgs} args - Arguments to create a MediaAsset.
     * @example
     * // Create one MediaAsset
     * const MediaAsset = await prisma.mediaAsset.create({
     *   data: {
     *     // ... data to create a MediaAsset
     *   }
     * })
     * 
     */
    create<T extends MediaAssetCreateArgs>(args: SelectSubset<T, MediaAssetCreateArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MediaAssets.
     * @param {MediaAssetCreateManyArgs} args - Arguments to create many MediaAssets.
     * @example
     * // Create many MediaAssets
     * const mediaAsset = await prisma.mediaAsset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MediaAssetCreateManyArgs>(args?: SelectSubset<T, MediaAssetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MediaAssets and returns the data saved in the database.
     * @param {MediaAssetCreateManyAndReturnArgs} args - Arguments to create many MediaAssets.
     * @example
     * // Create many MediaAssets
     * const mediaAsset = await prisma.mediaAsset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MediaAssets and only return the `id`
     * const mediaAssetWithIdOnly = await prisma.mediaAsset.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MediaAssetCreateManyAndReturnArgs>(args?: SelectSubset<T, MediaAssetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MediaAsset.
     * @param {MediaAssetDeleteArgs} args - Arguments to delete one MediaAsset.
     * @example
     * // Delete one MediaAsset
     * const MediaAsset = await prisma.mediaAsset.delete({
     *   where: {
     *     // ... filter to delete one MediaAsset
     *   }
     * })
     * 
     */
    delete<T extends MediaAssetDeleteArgs>(args: SelectSubset<T, MediaAssetDeleteArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MediaAsset.
     * @param {MediaAssetUpdateArgs} args - Arguments to update one MediaAsset.
     * @example
     * // Update one MediaAsset
     * const mediaAsset = await prisma.mediaAsset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MediaAssetUpdateArgs>(args: SelectSubset<T, MediaAssetUpdateArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MediaAssets.
     * @param {MediaAssetDeleteManyArgs} args - Arguments to filter MediaAssets to delete.
     * @example
     * // Delete a few MediaAssets
     * const { count } = await prisma.mediaAsset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MediaAssetDeleteManyArgs>(args?: SelectSubset<T, MediaAssetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MediaAssets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAssetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MediaAssets
     * const mediaAsset = await prisma.mediaAsset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MediaAssetUpdateManyArgs>(args: SelectSubset<T, MediaAssetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MediaAssets and returns the data updated in the database.
     * @param {MediaAssetUpdateManyAndReturnArgs} args - Arguments to update many MediaAssets.
     * @example
     * // Update many MediaAssets
     * const mediaAsset = await prisma.mediaAsset.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MediaAssets and only return the `id`
     * const mediaAssetWithIdOnly = await prisma.mediaAsset.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MediaAssetUpdateManyAndReturnArgs>(args: SelectSubset<T, MediaAssetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MediaAsset.
     * @param {MediaAssetUpsertArgs} args - Arguments to update or create a MediaAsset.
     * @example
     * // Update or create a MediaAsset
     * const mediaAsset = await prisma.mediaAsset.upsert({
     *   create: {
     *     // ... data to create a MediaAsset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MediaAsset we want to update
     *   }
     * })
     */
    upsert<T extends MediaAssetUpsertArgs>(args: SelectSubset<T, MediaAssetUpsertArgs<ExtArgs>>): Prisma__MediaAssetClient<$Result.GetResult<Prisma.$MediaAssetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MediaAssets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAssetCountArgs} args - Arguments to filter MediaAssets to count.
     * @example
     * // Count the number of MediaAssets
     * const count = await prisma.mediaAsset.count({
     *   where: {
     *     // ... the filter for the MediaAssets we want to count
     *   }
     * })
    **/
    count<T extends MediaAssetCountArgs>(
      args?: Subset<T, MediaAssetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MediaAssetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MediaAsset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAssetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MediaAssetAggregateArgs>(args: Subset<T, MediaAssetAggregateArgs>): Prisma.PrismaPromise<GetMediaAssetAggregateType<T>>

    /**
     * Group by MediaAsset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAssetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MediaAssetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MediaAssetGroupByArgs['orderBy'] }
        : { orderBy?: MediaAssetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MediaAssetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMediaAssetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MediaAsset model
   */
  readonly fields: MediaAssetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MediaAsset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MediaAssetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    album<T extends MediaAlbumDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MediaAlbumDefaultArgs<ExtArgs>>): Prisma__MediaAlbumClient<$Result.GetResult<Prisma.$MediaAlbumPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MediaAsset model
   */
  interface MediaAssetFieldRefs {
    readonly id: FieldRef<"MediaAsset", 'String'>
    readonly albumId: FieldRef<"MediaAsset", 'String'>
    readonly uri: FieldRef<"MediaAsset", 'String'>
    readonly mime: FieldRef<"MediaAsset", 'String'>
    readonly size: FieldRef<"MediaAsset", 'Int'>
    readonly width: FieldRef<"MediaAsset", 'Int'>
    readonly height: FieldRef<"MediaAsset", 'Int'>
    readonly createdAt: FieldRef<"MediaAsset", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MediaAsset findUnique
   */
  export type MediaAssetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAssetInclude<ExtArgs> | null
    /**
     * Filter, which MediaAsset to fetch.
     */
    where: MediaAssetWhereUniqueInput
  }

  /**
   * MediaAsset findUniqueOrThrow
   */
  export type MediaAssetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAssetInclude<ExtArgs> | null
    /**
     * Filter, which MediaAsset to fetch.
     */
    where: MediaAssetWhereUniqueInput
  }

  /**
   * MediaAsset findFirst
   */
  export type MediaAssetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAssetInclude<ExtArgs> | null
    /**
     * Filter, which MediaAsset to fetch.
     */
    where?: MediaAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaAssets to fetch.
     */
    orderBy?: MediaAssetOrderByWithRelationInput | MediaAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MediaAssets.
     */
    cursor?: MediaAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MediaAssets.
     */
    distinct?: MediaAssetScalarFieldEnum | MediaAssetScalarFieldEnum[]
  }

  /**
   * MediaAsset findFirstOrThrow
   */
  export type MediaAssetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAssetInclude<ExtArgs> | null
    /**
     * Filter, which MediaAsset to fetch.
     */
    where?: MediaAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaAssets to fetch.
     */
    orderBy?: MediaAssetOrderByWithRelationInput | MediaAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MediaAssets.
     */
    cursor?: MediaAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MediaAssets.
     */
    distinct?: MediaAssetScalarFieldEnum | MediaAssetScalarFieldEnum[]
  }

  /**
   * MediaAsset findMany
   */
  export type MediaAssetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAssetInclude<ExtArgs> | null
    /**
     * Filter, which MediaAssets to fetch.
     */
    where?: MediaAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaAssets to fetch.
     */
    orderBy?: MediaAssetOrderByWithRelationInput | MediaAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MediaAssets.
     */
    cursor?: MediaAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaAssets.
     */
    skip?: number
    distinct?: MediaAssetScalarFieldEnum | MediaAssetScalarFieldEnum[]
  }

  /**
   * MediaAsset create
   */
  export type MediaAssetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAssetInclude<ExtArgs> | null
    /**
     * The data needed to create a MediaAsset.
     */
    data: XOR<MediaAssetCreateInput, MediaAssetUncheckedCreateInput>
  }

  /**
   * MediaAsset createMany
   */
  export type MediaAssetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MediaAssets.
     */
    data: MediaAssetCreateManyInput | MediaAssetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MediaAsset createManyAndReturn
   */
  export type MediaAssetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * The data used to create many MediaAssets.
     */
    data: MediaAssetCreateManyInput | MediaAssetCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAssetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MediaAsset update
   */
  export type MediaAssetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAssetInclude<ExtArgs> | null
    /**
     * The data needed to update a MediaAsset.
     */
    data: XOR<MediaAssetUpdateInput, MediaAssetUncheckedUpdateInput>
    /**
     * Choose, which MediaAsset to update.
     */
    where: MediaAssetWhereUniqueInput
  }

  /**
   * MediaAsset updateMany
   */
  export type MediaAssetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MediaAssets.
     */
    data: XOR<MediaAssetUpdateManyMutationInput, MediaAssetUncheckedUpdateManyInput>
    /**
     * Filter which MediaAssets to update
     */
    where?: MediaAssetWhereInput
    /**
     * Limit how many MediaAssets to update.
     */
    limit?: number
  }

  /**
   * MediaAsset updateManyAndReturn
   */
  export type MediaAssetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * The data used to update MediaAssets.
     */
    data: XOR<MediaAssetUpdateManyMutationInput, MediaAssetUncheckedUpdateManyInput>
    /**
     * Filter which MediaAssets to update
     */
    where?: MediaAssetWhereInput
    /**
     * Limit how many MediaAssets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAssetIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MediaAsset upsert
   */
  export type MediaAssetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAssetInclude<ExtArgs> | null
    /**
     * The filter to search for the MediaAsset to update in case it exists.
     */
    where: MediaAssetWhereUniqueInput
    /**
     * In case the MediaAsset found by the `where` argument doesn't exist, create a new MediaAsset with this data.
     */
    create: XOR<MediaAssetCreateInput, MediaAssetUncheckedCreateInput>
    /**
     * In case the MediaAsset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MediaAssetUpdateInput, MediaAssetUncheckedUpdateInput>
  }

  /**
   * MediaAsset delete
   */
  export type MediaAssetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAssetInclude<ExtArgs> | null
    /**
     * Filter which MediaAsset to delete.
     */
    where: MediaAssetWhereUniqueInput
  }

  /**
   * MediaAsset deleteMany
   */
  export type MediaAssetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MediaAssets to delete
     */
    where?: MediaAssetWhereInput
    /**
     * Limit how many MediaAssets to delete.
     */
    limit?: number
  }

  /**
   * MediaAsset without action
   */
  export type MediaAssetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaAsset
     */
    select?: MediaAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaAsset
     */
    omit?: MediaAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaAssetInclude<ExtArgs> | null
  }


  /**
   * Model MatchRequest
   */

  export type AggregateMatchRequest = {
    _count: MatchRequestCountAggregateOutputType | null
    _min: MatchRequestMinAggregateOutputType | null
    _max: MatchRequestMaxAggregateOutputType | null
  }

  export type MatchRequestMinAggregateOutputType = {
    id: string | null
    requesterId: string | null
    query: string | null
    mode: $Enums.ChatMode | null
    createdAt: Date | null
    updatedAt: Date | null
    status: $Enums.MatchRequestStatus | null
    approvedCandidateId: string | null
  }

  export type MatchRequestMaxAggregateOutputType = {
    id: string | null
    requesterId: string | null
    query: string | null
    mode: $Enums.ChatMode | null
    createdAt: Date | null
    updatedAt: Date | null
    status: $Enums.MatchRequestStatus | null
    approvedCandidateId: string | null
  }

  export type MatchRequestCountAggregateOutputType = {
    id: number
    requesterId: number
    query: number
    mode: number
    createdAt: number
    updatedAt: number
    status: number
    approvedCandidateId: number
    _all: number
  }


  export type MatchRequestMinAggregateInputType = {
    id?: true
    requesterId?: true
    query?: true
    mode?: true
    createdAt?: true
    updatedAt?: true
    status?: true
    approvedCandidateId?: true
  }

  export type MatchRequestMaxAggregateInputType = {
    id?: true
    requesterId?: true
    query?: true
    mode?: true
    createdAt?: true
    updatedAt?: true
    status?: true
    approvedCandidateId?: true
  }

  export type MatchRequestCountAggregateInputType = {
    id?: true
    requesterId?: true
    query?: true
    mode?: true
    createdAt?: true
    updatedAt?: true
    status?: true
    approvedCandidateId?: true
    _all?: true
  }

  export type MatchRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchRequest to aggregate.
     */
    where?: MatchRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchRequests to fetch.
     */
    orderBy?: MatchRequestOrderByWithRelationInput | MatchRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MatchRequests
    **/
    _count?: true | MatchRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchRequestMaxAggregateInputType
  }

  export type GetMatchRequestAggregateType<T extends MatchRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateMatchRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatchRequest[P]>
      : GetScalarType<T[P], AggregateMatchRequest[P]>
  }




  export type MatchRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchRequestWhereInput
    orderBy?: MatchRequestOrderByWithAggregationInput | MatchRequestOrderByWithAggregationInput[]
    by: MatchRequestScalarFieldEnum[] | MatchRequestScalarFieldEnum
    having?: MatchRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchRequestCountAggregateInputType | true
    _min?: MatchRequestMinAggregateInputType
    _max?: MatchRequestMaxAggregateInputType
  }

  export type MatchRequestGroupByOutputType = {
    id: string
    requesterId: string
    query: string
    mode: $Enums.ChatMode | null
    createdAt: Date
    updatedAt: Date
    status: $Enums.MatchRequestStatus
    approvedCandidateId: string | null
    _count: MatchRequestCountAggregateOutputType | null
    _min: MatchRequestMinAggregateOutputType | null
    _max: MatchRequestMaxAggregateOutputType | null
  }

  type GetMatchRequestGroupByPayload<T extends MatchRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchRequestGroupByOutputType[P]>
            : GetScalarType<T[P], MatchRequestGroupByOutputType[P]>
        }
      >
    >


  export type MatchRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    query?: boolean
    mode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
    approvedCandidateId?: boolean
    candidates?: boolean | MatchRequest$candidatesArgs<ExtArgs>
    _count?: boolean | MatchRequestCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchRequest"]>

  export type MatchRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    query?: boolean
    mode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
    approvedCandidateId?: boolean
  }, ExtArgs["result"]["matchRequest"]>

  export type MatchRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    query?: boolean
    mode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
    approvedCandidateId?: boolean
  }, ExtArgs["result"]["matchRequest"]>

  export type MatchRequestSelectScalar = {
    id?: boolean
    requesterId?: boolean
    query?: boolean
    mode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
    approvedCandidateId?: boolean
  }

  export type MatchRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requesterId" | "query" | "mode" | "createdAt" | "updatedAt" | "status" | "approvedCandidateId", ExtArgs["result"]["matchRequest"]>
  export type MatchRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    candidates?: boolean | MatchRequest$candidatesArgs<ExtArgs>
    _count?: boolean | MatchRequestCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MatchRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MatchRequestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MatchRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MatchRequest"
    objects: {
      candidates: Prisma.$MatchCandidatePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requesterId: string
      query: string
      mode: $Enums.ChatMode | null
      createdAt: Date
      updatedAt: Date
      status: $Enums.MatchRequestStatus
      approvedCandidateId: string | null
    }, ExtArgs["result"]["matchRequest"]>
    composites: {}
  }

  type MatchRequestGetPayload<S extends boolean | null | undefined | MatchRequestDefaultArgs> = $Result.GetResult<Prisma.$MatchRequestPayload, S>

  type MatchRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchRequestCountAggregateInputType | true
    }

  export interface MatchRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MatchRequest'], meta: { name: 'MatchRequest' } }
    /**
     * Find zero or one MatchRequest that matches the filter.
     * @param {MatchRequestFindUniqueArgs} args - Arguments to find a MatchRequest
     * @example
     * // Get one MatchRequest
     * const matchRequest = await prisma.matchRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchRequestFindUniqueArgs>(args: SelectSubset<T, MatchRequestFindUniqueArgs<ExtArgs>>): Prisma__MatchRequestClient<$Result.GetResult<Prisma.$MatchRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MatchRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchRequestFindUniqueOrThrowArgs} args - Arguments to find a MatchRequest
     * @example
     * // Get one MatchRequest
     * const matchRequest = await prisma.matchRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchRequestClient<$Result.GetResult<Prisma.$MatchRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchRequestFindFirstArgs} args - Arguments to find a MatchRequest
     * @example
     * // Get one MatchRequest
     * const matchRequest = await prisma.matchRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchRequestFindFirstArgs>(args?: SelectSubset<T, MatchRequestFindFirstArgs<ExtArgs>>): Prisma__MatchRequestClient<$Result.GetResult<Prisma.$MatchRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchRequestFindFirstOrThrowArgs} args - Arguments to find a MatchRequest
     * @example
     * // Get one MatchRequest
     * const matchRequest = await prisma.matchRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchRequestClient<$Result.GetResult<Prisma.$MatchRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MatchRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MatchRequests
     * const matchRequests = await prisma.matchRequest.findMany()
     * 
     * // Get first 10 MatchRequests
     * const matchRequests = await prisma.matchRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchRequestWithIdOnly = await prisma.matchRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchRequestFindManyArgs>(args?: SelectSubset<T, MatchRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MatchRequest.
     * @param {MatchRequestCreateArgs} args - Arguments to create a MatchRequest.
     * @example
     * // Create one MatchRequest
     * const MatchRequest = await prisma.matchRequest.create({
     *   data: {
     *     // ... data to create a MatchRequest
     *   }
     * })
     * 
     */
    create<T extends MatchRequestCreateArgs>(args: SelectSubset<T, MatchRequestCreateArgs<ExtArgs>>): Prisma__MatchRequestClient<$Result.GetResult<Prisma.$MatchRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MatchRequests.
     * @param {MatchRequestCreateManyArgs} args - Arguments to create many MatchRequests.
     * @example
     * // Create many MatchRequests
     * const matchRequest = await prisma.matchRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchRequestCreateManyArgs>(args?: SelectSubset<T, MatchRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MatchRequests and returns the data saved in the database.
     * @param {MatchRequestCreateManyAndReturnArgs} args - Arguments to create many MatchRequests.
     * @example
     * // Create many MatchRequests
     * const matchRequest = await prisma.matchRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MatchRequests and only return the `id`
     * const matchRequestWithIdOnly = await prisma.matchRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MatchRequest.
     * @param {MatchRequestDeleteArgs} args - Arguments to delete one MatchRequest.
     * @example
     * // Delete one MatchRequest
     * const MatchRequest = await prisma.matchRequest.delete({
     *   where: {
     *     // ... filter to delete one MatchRequest
     *   }
     * })
     * 
     */
    delete<T extends MatchRequestDeleteArgs>(args: SelectSubset<T, MatchRequestDeleteArgs<ExtArgs>>): Prisma__MatchRequestClient<$Result.GetResult<Prisma.$MatchRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MatchRequest.
     * @param {MatchRequestUpdateArgs} args - Arguments to update one MatchRequest.
     * @example
     * // Update one MatchRequest
     * const matchRequest = await prisma.matchRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchRequestUpdateArgs>(args: SelectSubset<T, MatchRequestUpdateArgs<ExtArgs>>): Prisma__MatchRequestClient<$Result.GetResult<Prisma.$MatchRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MatchRequests.
     * @param {MatchRequestDeleteManyArgs} args - Arguments to filter MatchRequests to delete.
     * @example
     * // Delete a few MatchRequests
     * const { count } = await prisma.matchRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchRequestDeleteManyArgs>(args?: SelectSubset<T, MatchRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MatchRequests
     * const matchRequest = await prisma.matchRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchRequestUpdateManyArgs>(args: SelectSubset<T, MatchRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchRequests and returns the data updated in the database.
     * @param {MatchRequestUpdateManyAndReturnArgs} args - Arguments to update many MatchRequests.
     * @example
     * // Update many MatchRequests
     * const matchRequest = await prisma.matchRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MatchRequests and only return the `id`
     * const matchRequestWithIdOnly = await prisma.matchRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MatchRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MatchRequest.
     * @param {MatchRequestUpsertArgs} args - Arguments to update or create a MatchRequest.
     * @example
     * // Update or create a MatchRequest
     * const matchRequest = await prisma.matchRequest.upsert({
     *   create: {
     *     // ... data to create a MatchRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MatchRequest we want to update
     *   }
     * })
     */
    upsert<T extends MatchRequestUpsertArgs>(args: SelectSubset<T, MatchRequestUpsertArgs<ExtArgs>>): Prisma__MatchRequestClient<$Result.GetResult<Prisma.$MatchRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MatchRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchRequestCountArgs} args - Arguments to filter MatchRequests to count.
     * @example
     * // Count the number of MatchRequests
     * const count = await prisma.matchRequest.count({
     *   where: {
     *     // ... the filter for the MatchRequests we want to count
     *   }
     * })
    **/
    count<T extends MatchRequestCountArgs>(
      args?: Subset<T, MatchRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MatchRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MatchRequestAggregateArgs>(args: Subset<T, MatchRequestAggregateArgs>): Prisma.PrismaPromise<GetMatchRequestAggregateType<T>>

    /**
     * Group by MatchRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MatchRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchRequestGroupByArgs['orderBy'] }
        : { orderBy?: MatchRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MatchRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MatchRequest model
   */
  readonly fields: MatchRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MatchRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    candidates<T extends MatchRequest$candidatesArgs<ExtArgs> = {}>(args?: Subset<T, MatchRequest$candidatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchCandidatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MatchRequest model
   */
  interface MatchRequestFieldRefs {
    readonly id: FieldRef<"MatchRequest", 'String'>
    readonly requesterId: FieldRef<"MatchRequest", 'String'>
    readonly query: FieldRef<"MatchRequest", 'String'>
    readonly mode: FieldRef<"MatchRequest", 'ChatMode'>
    readonly createdAt: FieldRef<"MatchRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"MatchRequest", 'DateTime'>
    readonly status: FieldRef<"MatchRequest", 'MatchRequestStatus'>
    readonly approvedCandidateId: FieldRef<"MatchRequest", 'String'>
  }
    

  // Custom InputTypes
  /**
   * MatchRequest findUnique
   */
  export type MatchRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchRequest
     */
    select?: MatchRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchRequest
     */
    omit?: MatchRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchRequestInclude<ExtArgs> | null
    /**
     * Filter, which MatchRequest to fetch.
     */
    where: MatchRequestWhereUniqueInput
  }

  /**
   * MatchRequest findUniqueOrThrow
   */
  export type MatchRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchRequest
     */
    select?: MatchRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchRequest
     */
    omit?: MatchRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchRequestInclude<ExtArgs> | null
    /**
     * Filter, which MatchRequest to fetch.
     */
    where: MatchRequestWhereUniqueInput
  }

  /**
   * MatchRequest findFirst
   */
  export type MatchRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchRequest
     */
    select?: MatchRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchRequest
     */
    omit?: MatchRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchRequestInclude<ExtArgs> | null
    /**
     * Filter, which MatchRequest to fetch.
     */
    where?: MatchRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchRequests to fetch.
     */
    orderBy?: MatchRequestOrderByWithRelationInput | MatchRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchRequests.
     */
    cursor?: MatchRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchRequests.
     */
    distinct?: MatchRequestScalarFieldEnum | MatchRequestScalarFieldEnum[]
  }

  /**
   * MatchRequest findFirstOrThrow
   */
  export type MatchRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchRequest
     */
    select?: MatchRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchRequest
     */
    omit?: MatchRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchRequestInclude<ExtArgs> | null
    /**
     * Filter, which MatchRequest to fetch.
     */
    where?: MatchRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchRequests to fetch.
     */
    orderBy?: MatchRequestOrderByWithRelationInput | MatchRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchRequests.
     */
    cursor?: MatchRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchRequests.
     */
    distinct?: MatchRequestScalarFieldEnum | MatchRequestScalarFieldEnum[]
  }

  /**
   * MatchRequest findMany
   */
  export type MatchRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchRequest
     */
    select?: MatchRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchRequest
     */
    omit?: MatchRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchRequestInclude<ExtArgs> | null
    /**
     * Filter, which MatchRequests to fetch.
     */
    where?: MatchRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchRequests to fetch.
     */
    orderBy?: MatchRequestOrderByWithRelationInput | MatchRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MatchRequests.
     */
    cursor?: MatchRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchRequests.
     */
    skip?: number
    distinct?: MatchRequestScalarFieldEnum | MatchRequestScalarFieldEnum[]
  }

  /**
   * MatchRequest create
   */
  export type MatchRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchRequest
     */
    select?: MatchRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchRequest
     */
    omit?: MatchRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a MatchRequest.
     */
    data: XOR<MatchRequestCreateInput, MatchRequestUncheckedCreateInput>
  }

  /**
   * MatchRequest createMany
   */
  export type MatchRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MatchRequests.
     */
    data: MatchRequestCreateManyInput | MatchRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MatchRequest createManyAndReturn
   */
  export type MatchRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchRequest
     */
    select?: MatchRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchRequest
     */
    omit?: MatchRequestOmit<ExtArgs> | null
    /**
     * The data used to create many MatchRequests.
     */
    data: MatchRequestCreateManyInput | MatchRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MatchRequest update
   */
  export type MatchRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchRequest
     */
    select?: MatchRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchRequest
     */
    omit?: MatchRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a MatchRequest.
     */
    data: XOR<MatchRequestUpdateInput, MatchRequestUncheckedUpdateInput>
    /**
     * Choose, which MatchRequest to update.
     */
    where: MatchRequestWhereUniqueInput
  }

  /**
   * MatchRequest updateMany
   */
  export type MatchRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MatchRequests.
     */
    data: XOR<MatchRequestUpdateManyMutationInput, MatchRequestUncheckedUpdateManyInput>
    /**
     * Filter which MatchRequests to update
     */
    where?: MatchRequestWhereInput
    /**
     * Limit how many MatchRequests to update.
     */
    limit?: number
  }

  /**
   * MatchRequest updateManyAndReturn
   */
  export type MatchRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchRequest
     */
    select?: MatchRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchRequest
     */
    omit?: MatchRequestOmit<ExtArgs> | null
    /**
     * The data used to update MatchRequests.
     */
    data: XOR<MatchRequestUpdateManyMutationInput, MatchRequestUncheckedUpdateManyInput>
    /**
     * Filter which MatchRequests to update
     */
    where?: MatchRequestWhereInput
    /**
     * Limit how many MatchRequests to update.
     */
    limit?: number
  }

  /**
   * MatchRequest upsert
   */
  export type MatchRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchRequest
     */
    select?: MatchRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchRequest
     */
    omit?: MatchRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the MatchRequest to update in case it exists.
     */
    where: MatchRequestWhereUniqueInput
    /**
     * In case the MatchRequest found by the `where` argument doesn't exist, create a new MatchRequest with this data.
     */
    create: XOR<MatchRequestCreateInput, MatchRequestUncheckedCreateInput>
    /**
     * In case the MatchRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchRequestUpdateInput, MatchRequestUncheckedUpdateInput>
  }

  /**
   * MatchRequest delete
   */
  export type MatchRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchRequest
     */
    select?: MatchRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchRequest
     */
    omit?: MatchRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchRequestInclude<ExtArgs> | null
    /**
     * Filter which MatchRequest to delete.
     */
    where: MatchRequestWhereUniqueInput
  }

  /**
   * MatchRequest deleteMany
   */
  export type MatchRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchRequests to delete
     */
    where?: MatchRequestWhereInput
    /**
     * Limit how many MatchRequests to delete.
     */
    limit?: number
  }

  /**
   * MatchRequest.candidates
   */
  export type MatchRequest$candidatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCandidate
     */
    select?: MatchCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchCandidate
     */
    omit?: MatchCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchCandidateInclude<ExtArgs> | null
    where?: MatchCandidateWhereInput
    orderBy?: MatchCandidateOrderByWithRelationInput | MatchCandidateOrderByWithRelationInput[]
    cursor?: MatchCandidateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchCandidateScalarFieldEnum | MatchCandidateScalarFieldEnum[]
  }

  /**
   * MatchRequest without action
   */
  export type MatchRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchRequest
     */
    select?: MatchRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchRequest
     */
    omit?: MatchRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchRequestInclude<ExtArgs> | null
  }


  /**
   * Model MatchCandidate
   */

  export type AggregateMatchCandidate = {
    _count: MatchCandidateCountAggregateOutputType | null
    _min: MatchCandidateMinAggregateOutputType | null
    _max: MatchCandidateMaxAggregateOutputType | null
  }

  export type MatchCandidateMinAggregateOutputType = {
    id: string | null
    requestId: string | null
    candidateUserId: string | null
    sourceDocId: string | null
    snippet: string | null
    status: $Enums.MatchCandidateStatus | null
    decidedAt: Date | null
    createdAt: Date | null
  }

  export type MatchCandidateMaxAggregateOutputType = {
    id: string | null
    requestId: string | null
    candidateUserId: string | null
    sourceDocId: string | null
    snippet: string | null
    status: $Enums.MatchCandidateStatus | null
    decidedAt: Date | null
    createdAt: Date | null
  }

  export type MatchCandidateCountAggregateOutputType = {
    id: number
    requestId: number
    candidateUserId: number
    sourceDocId: number
    snippet: number
    status: number
    decidedAt: number
    createdAt: number
    _all: number
  }


  export type MatchCandidateMinAggregateInputType = {
    id?: true
    requestId?: true
    candidateUserId?: true
    sourceDocId?: true
    snippet?: true
    status?: true
    decidedAt?: true
    createdAt?: true
  }

  export type MatchCandidateMaxAggregateInputType = {
    id?: true
    requestId?: true
    candidateUserId?: true
    sourceDocId?: true
    snippet?: true
    status?: true
    decidedAt?: true
    createdAt?: true
  }

  export type MatchCandidateCountAggregateInputType = {
    id?: true
    requestId?: true
    candidateUserId?: true
    sourceDocId?: true
    snippet?: true
    status?: true
    decidedAt?: true
    createdAt?: true
    _all?: true
  }

  export type MatchCandidateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchCandidate to aggregate.
     */
    where?: MatchCandidateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchCandidates to fetch.
     */
    orderBy?: MatchCandidateOrderByWithRelationInput | MatchCandidateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchCandidateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchCandidates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchCandidates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MatchCandidates
    **/
    _count?: true | MatchCandidateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchCandidateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchCandidateMaxAggregateInputType
  }

  export type GetMatchCandidateAggregateType<T extends MatchCandidateAggregateArgs> = {
        [P in keyof T & keyof AggregateMatchCandidate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatchCandidate[P]>
      : GetScalarType<T[P], AggregateMatchCandidate[P]>
  }




  export type MatchCandidateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchCandidateWhereInput
    orderBy?: MatchCandidateOrderByWithAggregationInput | MatchCandidateOrderByWithAggregationInput[]
    by: MatchCandidateScalarFieldEnum[] | MatchCandidateScalarFieldEnum
    having?: MatchCandidateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchCandidateCountAggregateInputType | true
    _min?: MatchCandidateMinAggregateInputType
    _max?: MatchCandidateMaxAggregateInputType
  }

  export type MatchCandidateGroupByOutputType = {
    id: string
    requestId: string
    candidateUserId: string
    sourceDocId: string | null
    snippet: string | null
    status: $Enums.MatchCandidateStatus
    decidedAt: Date | null
    createdAt: Date
    _count: MatchCandidateCountAggregateOutputType | null
    _min: MatchCandidateMinAggregateOutputType | null
    _max: MatchCandidateMaxAggregateOutputType | null
  }

  type GetMatchCandidateGroupByPayload<T extends MatchCandidateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchCandidateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchCandidateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchCandidateGroupByOutputType[P]>
            : GetScalarType<T[P], MatchCandidateGroupByOutputType[P]>
        }
      >
    >


  export type MatchCandidateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    candidateUserId?: boolean
    sourceDocId?: boolean
    snippet?: boolean
    status?: boolean
    decidedAt?: boolean
    createdAt?: boolean
    request?: boolean | MatchRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchCandidate"]>

  export type MatchCandidateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    candidateUserId?: boolean
    sourceDocId?: boolean
    snippet?: boolean
    status?: boolean
    decidedAt?: boolean
    createdAt?: boolean
    request?: boolean | MatchRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchCandidate"]>

  export type MatchCandidateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    candidateUserId?: boolean
    sourceDocId?: boolean
    snippet?: boolean
    status?: boolean
    decidedAt?: boolean
    createdAt?: boolean
    request?: boolean | MatchRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchCandidate"]>

  export type MatchCandidateSelectScalar = {
    id?: boolean
    requestId?: boolean
    candidateUserId?: boolean
    sourceDocId?: boolean
    snippet?: boolean
    status?: boolean
    decidedAt?: boolean
    createdAt?: boolean
  }

  export type MatchCandidateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requestId" | "candidateUserId" | "sourceDocId" | "snippet" | "status" | "decidedAt" | "createdAt", ExtArgs["result"]["matchCandidate"]>
  export type MatchCandidateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | MatchRequestDefaultArgs<ExtArgs>
  }
  export type MatchCandidateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | MatchRequestDefaultArgs<ExtArgs>
  }
  export type MatchCandidateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | MatchRequestDefaultArgs<ExtArgs>
  }

  export type $MatchCandidatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MatchCandidate"
    objects: {
      request: Prisma.$MatchRequestPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requestId: string
      candidateUserId: string
      sourceDocId: string | null
      snippet: string | null
      status: $Enums.MatchCandidateStatus
      decidedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["matchCandidate"]>
    composites: {}
  }

  type MatchCandidateGetPayload<S extends boolean | null | undefined | MatchCandidateDefaultArgs> = $Result.GetResult<Prisma.$MatchCandidatePayload, S>

  type MatchCandidateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchCandidateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchCandidateCountAggregateInputType | true
    }

  export interface MatchCandidateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MatchCandidate'], meta: { name: 'MatchCandidate' } }
    /**
     * Find zero or one MatchCandidate that matches the filter.
     * @param {MatchCandidateFindUniqueArgs} args - Arguments to find a MatchCandidate
     * @example
     * // Get one MatchCandidate
     * const matchCandidate = await prisma.matchCandidate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchCandidateFindUniqueArgs>(args: SelectSubset<T, MatchCandidateFindUniqueArgs<ExtArgs>>): Prisma__MatchCandidateClient<$Result.GetResult<Prisma.$MatchCandidatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MatchCandidate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchCandidateFindUniqueOrThrowArgs} args - Arguments to find a MatchCandidate
     * @example
     * // Get one MatchCandidate
     * const matchCandidate = await prisma.matchCandidate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchCandidateFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchCandidateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchCandidateClient<$Result.GetResult<Prisma.$MatchCandidatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchCandidate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCandidateFindFirstArgs} args - Arguments to find a MatchCandidate
     * @example
     * // Get one MatchCandidate
     * const matchCandidate = await prisma.matchCandidate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchCandidateFindFirstArgs>(args?: SelectSubset<T, MatchCandidateFindFirstArgs<ExtArgs>>): Prisma__MatchCandidateClient<$Result.GetResult<Prisma.$MatchCandidatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchCandidate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCandidateFindFirstOrThrowArgs} args - Arguments to find a MatchCandidate
     * @example
     * // Get one MatchCandidate
     * const matchCandidate = await prisma.matchCandidate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchCandidateFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchCandidateFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchCandidateClient<$Result.GetResult<Prisma.$MatchCandidatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MatchCandidates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCandidateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MatchCandidates
     * const matchCandidates = await prisma.matchCandidate.findMany()
     * 
     * // Get first 10 MatchCandidates
     * const matchCandidates = await prisma.matchCandidate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchCandidateWithIdOnly = await prisma.matchCandidate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchCandidateFindManyArgs>(args?: SelectSubset<T, MatchCandidateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchCandidatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MatchCandidate.
     * @param {MatchCandidateCreateArgs} args - Arguments to create a MatchCandidate.
     * @example
     * // Create one MatchCandidate
     * const MatchCandidate = await prisma.matchCandidate.create({
     *   data: {
     *     // ... data to create a MatchCandidate
     *   }
     * })
     * 
     */
    create<T extends MatchCandidateCreateArgs>(args: SelectSubset<T, MatchCandidateCreateArgs<ExtArgs>>): Prisma__MatchCandidateClient<$Result.GetResult<Prisma.$MatchCandidatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MatchCandidates.
     * @param {MatchCandidateCreateManyArgs} args - Arguments to create many MatchCandidates.
     * @example
     * // Create many MatchCandidates
     * const matchCandidate = await prisma.matchCandidate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchCandidateCreateManyArgs>(args?: SelectSubset<T, MatchCandidateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MatchCandidates and returns the data saved in the database.
     * @param {MatchCandidateCreateManyAndReturnArgs} args - Arguments to create many MatchCandidates.
     * @example
     * // Create many MatchCandidates
     * const matchCandidate = await prisma.matchCandidate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MatchCandidates and only return the `id`
     * const matchCandidateWithIdOnly = await prisma.matchCandidate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchCandidateCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchCandidateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchCandidatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MatchCandidate.
     * @param {MatchCandidateDeleteArgs} args - Arguments to delete one MatchCandidate.
     * @example
     * // Delete one MatchCandidate
     * const MatchCandidate = await prisma.matchCandidate.delete({
     *   where: {
     *     // ... filter to delete one MatchCandidate
     *   }
     * })
     * 
     */
    delete<T extends MatchCandidateDeleteArgs>(args: SelectSubset<T, MatchCandidateDeleteArgs<ExtArgs>>): Prisma__MatchCandidateClient<$Result.GetResult<Prisma.$MatchCandidatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MatchCandidate.
     * @param {MatchCandidateUpdateArgs} args - Arguments to update one MatchCandidate.
     * @example
     * // Update one MatchCandidate
     * const matchCandidate = await prisma.matchCandidate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchCandidateUpdateArgs>(args: SelectSubset<T, MatchCandidateUpdateArgs<ExtArgs>>): Prisma__MatchCandidateClient<$Result.GetResult<Prisma.$MatchCandidatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MatchCandidates.
     * @param {MatchCandidateDeleteManyArgs} args - Arguments to filter MatchCandidates to delete.
     * @example
     * // Delete a few MatchCandidates
     * const { count } = await prisma.matchCandidate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchCandidateDeleteManyArgs>(args?: SelectSubset<T, MatchCandidateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchCandidates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCandidateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MatchCandidates
     * const matchCandidate = await prisma.matchCandidate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchCandidateUpdateManyArgs>(args: SelectSubset<T, MatchCandidateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchCandidates and returns the data updated in the database.
     * @param {MatchCandidateUpdateManyAndReturnArgs} args - Arguments to update many MatchCandidates.
     * @example
     * // Update many MatchCandidates
     * const matchCandidate = await prisma.matchCandidate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MatchCandidates and only return the `id`
     * const matchCandidateWithIdOnly = await prisma.matchCandidate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MatchCandidateUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchCandidateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchCandidatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MatchCandidate.
     * @param {MatchCandidateUpsertArgs} args - Arguments to update or create a MatchCandidate.
     * @example
     * // Update or create a MatchCandidate
     * const matchCandidate = await prisma.matchCandidate.upsert({
     *   create: {
     *     // ... data to create a MatchCandidate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MatchCandidate we want to update
     *   }
     * })
     */
    upsert<T extends MatchCandidateUpsertArgs>(args: SelectSubset<T, MatchCandidateUpsertArgs<ExtArgs>>): Prisma__MatchCandidateClient<$Result.GetResult<Prisma.$MatchCandidatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MatchCandidates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCandidateCountArgs} args - Arguments to filter MatchCandidates to count.
     * @example
     * // Count the number of MatchCandidates
     * const count = await prisma.matchCandidate.count({
     *   where: {
     *     // ... the filter for the MatchCandidates we want to count
     *   }
     * })
    **/
    count<T extends MatchCandidateCountArgs>(
      args?: Subset<T, MatchCandidateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchCandidateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MatchCandidate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCandidateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MatchCandidateAggregateArgs>(args: Subset<T, MatchCandidateAggregateArgs>): Prisma.PrismaPromise<GetMatchCandidateAggregateType<T>>

    /**
     * Group by MatchCandidate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCandidateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MatchCandidateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchCandidateGroupByArgs['orderBy'] }
        : { orderBy?: MatchCandidateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MatchCandidateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchCandidateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MatchCandidate model
   */
  readonly fields: MatchCandidateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MatchCandidate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchCandidateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    request<T extends MatchRequestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MatchRequestDefaultArgs<ExtArgs>>): Prisma__MatchRequestClient<$Result.GetResult<Prisma.$MatchRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MatchCandidate model
   */
  interface MatchCandidateFieldRefs {
    readonly id: FieldRef<"MatchCandidate", 'String'>
    readonly requestId: FieldRef<"MatchCandidate", 'String'>
    readonly candidateUserId: FieldRef<"MatchCandidate", 'String'>
    readonly sourceDocId: FieldRef<"MatchCandidate", 'String'>
    readonly snippet: FieldRef<"MatchCandidate", 'String'>
    readonly status: FieldRef<"MatchCandidate", 'MatchCandidateStatus'>
    readonly decidedAt: FieldRef<"MatchCandidate", 'DateTime'>
    readonly createdAt: FieldRef<"MatchCandidate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MatchCandidate findUnique
   */
  export type MatchCandidateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCandidate
     */
    select?: MatchCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchCandidate
     */
    omit?: MatchCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchCandidateInclude<ExtArgs> | null
    /**
     * Filter, which MatchCandidate to fetch.
     */
    where: MatchCandidateWhereUniqueInput
  }

  /**
   * MatchCandidate findUniqueOrThrow
   */
  export type MatchCandidateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCandidate
     */
    select?: MatchCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchCandidate
     */
    omit?: MatchCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchCandidateInclude<ExtArgs> | null
    /**
     * Filter, which MatchCandidate to fetch.
     */
    where: MatchCandidateWhereUniqueInput
  }

  /**
   * MatchCandidate findFirst
   */
  export type MatchCandidateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCandidate
     */
    select?: MatchCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchCandidate
     */
    omit?: MatchCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchCandidateInclude<ExtArgs> | null
    /**
     * Filter, which MatchCandidate to fetch.
     */
    where?: MatchCandidateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchCandidates to fetch.
     */
    orderBy?: MatchCandidateOrderByWithRelationInput | MatchCandidateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchCandidates.
     */
    cursor?: MatchCandidateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchCandidates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchCandidates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchCandidates.
     */
    distinct?: MatchCandidateScalarFieldEnum | MatchCandidateScalarFieldEnum[]
  }

  /**
   * MatchCandidate findFirstOrThrow
   */
  export type MatchCandidateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCandidate
     */
    select?: MatchCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchCandidate
     */
    omit?: MatchCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchCandidateInclude<ExtArgs> | null
    /**
     * Filter, which MatchCandidate to fetch.
     */
    where?: MatchCandidateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchCandidates to fetch.
     */
    orderBy?: MatchCandidateOrderByWithRelationInput | MatchCandidateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchCandidates.
     */
    cursor?: MatchCandidateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchCandidates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchCandidates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchCandidates.
     */
    distinct?: MatchCandidateScalarFieldEnum | MatchCandidateScalarFieldEnum[]
  }

  /**
   * MatchCandidate findMany
   */
  export type MatchCandidateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCandidate
     */
    select?: MatchCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchCandidate
     */
    omit?: MatchCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchCandidateInclude<ExtArgs> | null
    /**
     * Filter, which MatchCandidates to fetch.
     */
    where?: MatchCandidateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchCandidates to fetch.
     */
    orderBy?: MatchCandidateOrderByWithRelationInput | MatchCandidateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MatchCandidates.
     */
    cursor?: MatchCandidateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchCandidates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchCandidates.
     */
    skip?: number
    distinct?: MatchCandidateScalarFieldEnum | MatchCandidateScalarFieldEnum[]
  }

  /**
   * MatchCandidate create
   */
  export type MatchCandidateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCandidate
     */
    select?: MatchCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchCandidate
     */
    omit?: MatchCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchCandidateInclude<ExtArgs> | null
    /**
     * The data needed to create a MatchCandidate.
     */
    data: XOR<MatchCandidateCreateInput, MatchCandidateUncheckedCreateInput>
  }

  /**
   * MatchCandidate createMany
   */
  export type MatchCandidateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MatchCandidates.
     */
    data: MatchCandidateCreateManyInput | MatchCandidateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MatchCandidate createManyAndReturn
   */
  export type MatchCandidateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCandidate
     */
    select?: MatchCandidateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchCandidate
     */
    omit?: MatchCandidateOmit<ExtArgs> | null
    /**
     * The data used to create many MatchCandidates.
     */
    data: MatchCandidateCreateManyInput | MatchCandidateCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchCandidateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MatchCandidate update
   */
  export type MatchCandidateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCandidate
     */
    select?: MatchCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchCandidate
     */
    omit?: MatchCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchCandidateInclude<ExtArgs> | null
    /**
     * The data needed to update a MatchCandidate.
     */
    data: XOR<MatchCandidateUpdateInput, MatchCandidateUncheckedUpdateInput>
    /**
     * Choose, which MatchCandidate to update.
     */
    where: MatchCandidateWhereUniqueInput
  }

  /**
   * MatchCandidate updateMany
   */
  export type MatchCandidateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MatchCandidates.
     */
    data: XOR<MatchCandidateUpdateManyMutationInput, MatchCandidateUncheckedUpdateManyInput>
    /**
     * Filter which MatchCandidates to update
     */
    where?: MatchCandidateWhereInput
    /**
     * Limit how many MatchCandidates to update.
     */
    limit?: number
  }

  /**
   * MatchCandidate updateManyAndReturn
   */
  export type MatchCandidateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCandidate
     */
    select?: MatchCandidateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchCandidate
     */
    omit?: MatchCandidateOmit<ExtArgs> | null
    /**
     * The data used to update MatchCandidates.
     */
    data: XOR<MatchCandidateUpdateManyMutationInput, MatchCandidateUncheckedUpdateManyInput>
    /**
     * Filter which MatchCandidates to update
     */
    where?: MatchCandidateWhereInput
    /**
     * Limit how many MatchCandidates to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchCandidateIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MatchCandidate upsert
   */
  export type MatchCandidateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCandidate
     */
    select?: MatchCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchCandidate
     */
    omit?: MatchCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchCandidateInclude<ExtArgs> | null
    /**
     * The filter to search for the MatchCandidate to update in case it exists.
     */
    where: MatchCandidateWhereUniqueInput
    /**
     * In case the MatchCandidate found by the `where` argument doesn't exist, create a new MatchCandidate with this data.
     */
    create: XOR<MatchCandidateCreateInput, MatchCandidateUncheckedCreateInput>
    /**
     * In case the MatchCandidate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchCandidateUpdateInput, MatchCandidateUncheckedUpdateInput>
  }

  /**
   * MatchCandidate delete
   */
  export type MatchCandidateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCandidate
     */
    select?: MatchCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchCandidate
     */
    omit?: MatchCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchCandidateInclude<ExtArgs> | null
    /**
     * Filter which MatchCandidate to delete.
     */
    where: MatchCandidateWhereUniqueInput
  }

  /**
   * MatchCandidate deleteMany
   */
  export type MatchCandidateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchCandidates to delete
     */
    where?: MatchCandidateWhereInput
    /**
     * Limit how many MatchCandidates to delete.
     */
    limit?: number
  }

  /**
   * MatchCandidate without action
   */
  export type MatchCandidateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCandidate
     */
    select?: MatchCandidateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchCandidate
     */
    omit?: MatchCandidateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchCandidateInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ChatConversationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ChatConversationScalarFieldEnum = (typeof ChatConversationScalarFieldEnum)[keyof typeof ChatConversationScalarFieldEnum]


  export const ChatMessageScalarFieldEnum: {
    id: 'id',
    conversationId: 'conversationId',
    role: 'role',
    text: 'text',
    source: 'source',
    mode: 'mode',
    answersCount: 'answersCount',
    finalType: 'finalType',
    meta: 'meta',
    createdAt: 'createdAt'
  };

  export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum]


  export const ConfessionConversationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ConfessionConversationScalarFieldEnum = (typeof ConfessionConversationScalarFieldEnum)[keyof typeof ConfessionConversationScalarFieldEnum]


  export const ConfessionMessageScalarFieldEnum: {
    id: 'id',
    conversationId: 'conversationId',
    role: 'role',
    text: 'text',
    createdAt: 'createdAt'
  };

  export type ConfessionMessageScalarFieldEnum = (typeof ConfessionMessageScalarFieldEnum)[keyof typeof ConfessionMessageScalarFieldEnum]


  export const MediaAlbumScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MediaAlbumScalarFieldEnum = (typeof MediaAlbumScalarFieldEnum)[keyof typeof MediaAlbumScalarFieldEnum]


  export const MediaAssetScalarFieldEnum: {
    id: 'id',
    albumId: 'albumId',
    uri: 'uri',
    mime: 'mime',
    size: 'size',
    width: 'width',
    height: 'height',
    createdAt: 'createdAt'
  };

  export type MediaAssetScalarFieldEnum = (typeof MediaAssetScalarFieldEnum)[keyof typeof MediaAssetScalarFieldEnum]


  export const MatchRequestScalarFieldEnum: {
    id: 'id',
    requesterId: 'requesterId',
    query: 'query',
    mode: 'mode',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    status: 'status',
    approvedCandidateId: 'approvedCandidateId'
  };

  export type MatchRequestScalarFieldEnum = (typeof MatchRequestScalarFieldEnum)[keyof typeof MatchRequestScalarFieldEnum]


  export const MatchCandidateScalarFieldEnum: {
    id: 'id',
    requestId: 'requestId',
    candidateUserId: 'candidateUserId',
    sourceDocId: 'sourceDocId',
    snippet: 'snippet',
    status: 'status',
    decidedAt: 'decidedAt',
    createdAt: 'createdAt'
  };

  export type MatchCandidateScalarFieldEnum = (typeof MatchCandidateScalarFieldEnum)[keyof typeof MatchCandidateScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'ChatSource'
   */
  export type EnumChatSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChatSource'>
    


  /**
   * Reference to a field of type 'ChatSource[]'
   */
  export type ListEnumChatSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChatSource[]'>
    


  /**
   * Reference to a field of type 'ChatMode'
   */
  export type EnumChatModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChatMode'>
    


  /**
   * Reference to a field of type 'ChatMode[]'
   */
  export type ListEnumChatModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChatMode[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'MatchRequestStatus'
   */
  export type EnumMatchRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchRequestStatus'>
    


  /**
   * Reference to a field of type 'MatchRequestStatus[]'
   */
  export type ListEnumMatchRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchRequestStatus[]'>
    


  /**
   * Reference to a field of type 'MatchCandidateStatus'
   */
  export type EnumMatchCandidateStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchCandidateStatus'>
    


  /**
   * Reference to a field of type 'MatchCandidateStatus[]'
   */
  export type ListEnumMatchCandidateStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchCandidateStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ChatConversationWhereInput = {
    AND?: ChatConversationWhereInput | ChatConversationWhereInput[]
    OR?: ChatConversationWhereInput[]
    NOT?: ChatConversationWhereInput | ChatConversationWhereInput[]
    id?: StringFilter<"ChatConversation"> | string
    userId?: StringNullableFilter<"ChatConversation"> | string | null
    title?: StringNullableFilter<"ChatConversation"> | string | null
    createdAt?: DateTimeFilter<"ChatConversation"> | Date | string
    updatedAt?: DateTimeFilter<"ChatConversation"> | Date | string
    messages?: ChatMessageListRelationFilter
  }

  export type ChatConversationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    messages?: ChatMessageOrderByRelationAggregateInput
  }

  export type ChatConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatConversationWhereInput | ChatConversationWhereInput[]
    OR?: ChatConversationWhereInput[]
    NOT?: ChatConversationWhereInput | ChatConversationWhereInput[]
    userId?: StringNullableFilter<"ChatConversation"> | string | null
    title?: StringNullableFilter<"ChatConversation"> | string | null
    createdAt?: DateTimeFilter<"ChatConversation"> | Date | string
    updatedAt?: DateTimeFilter<"ChatConversation"> | Date | string
    messages?: ChatMessageListRelationFilter
  }, "id">

  export type ChatConversationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChatConversationCountOrderByAggregateInput
    _max?: ChatConversationMaxOrderByAggregateInput
    _min?: ChatConversationMinOrderByAggregateInput
  }

  export type ChatConversationScalarWhereWithAggregatesInput = {
    AND?: ChatConversationScalarWhereWithAggregatesInput | ChatConversationScalarWhereWithAggregatesInput[]
    OR?: ChatConversationScalarWhereWithAggregatesInput[]
    NOT?: ChatConversationScalarWhereWithAggregatesInput | ChatConversationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatConversation"> | string
    userId?: StringNullableWithAggregatesFilter<"ChatConversation"> | string | null
    title?: StringNullableWithAggregatesFilter<"ChatConversation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ChatConversation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChatConversation"> | Date | string
  }

  export type ChatMessageWhereInput = {
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    conversationId?: StringFilter<"ChatMessage"> | string
    role?: StringFilter<"ChatMessage"> | string
    text?: StringFilter<"ChatMessage"> | string
    source?: EnumChatSourceNullableFilter<"ChatMessage"> | $Enums.ChatSource | null
    mode?: EnumChatModeNullableFilter<"ChatMessage"> | $Enums.ChatMode | null
    answersCount?: IntNullableFilter<"ChatMessage"> | number | null
    finalType?: StringNullableFilter<"ChatMessage"> | string | null
    meta?: JsonNullableFilter<"ChatMessage">
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    conversation?: XOR<ChatConversationScalarRelationFilter, ChatConversationWhereInput>
  }

  export type ChatMessageOrderByWithRelationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    text?: SortOrder
    source?: SortOrderInput | SortOrder
    mode?: SortOrderInput | SortOrder
    answersCount?: SortOrderInput | SortOrder
    finalType?: SortOrderInput | SortOrder
    meta?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    conversation?: ChatConversationOrderByWithRelationInput
  }

  export type ChatMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    conversationId?: StringFilter<"ChatMessage"> | string
    role?: StringFilter<"ChatMessage"> | string
    text?: StringFilter<"ChatMessage"> | string
    source?: EnumChatSourceNullableFilter<"ChatMessage"> | $Enums.ChatSource | null
    mode?: EnumChatModeNullableFilter<"ChatMessage"> | $Enums.ChatMode | null
    answersCount?: IntNullableFilter<"ChatMessage"> | number | null
    finalType?: StringNullableFilter<"ChatMessage"> | string | null
    meta?: JsonNullableFilter<"ChatMessage">
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    conversation?: XOR<ChatConversationScalarRelationFilter, ChatConversationWhereInput>
  }, "id">

  export type ChatMessageOrderByWithAggregationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    text?: SortOrder
    source?: SortOrderInput | SortOrder
    mode?: SortOrderInput | SortOrder
    answersCount?: SortOrderInput | SortOrder
    finalType?: SortOrderInput | SortOrder
    meta?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ChatMessageCountOrderByAggregateInput
    _avg?: ChatMessageAvgOrderByAggregateInput
    _max?: ChatMessageMaxOrderByAggregateInput
    _min?: ChatMessageMinOrderByAggregateInput
    _sum?: ChatMessageSumOrderByAggregateInput
  }

  export type ChatMessageScalarWhereWithAggregatesInput = {
    AND?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    OR?: ChatMessageScalarWhereWithAggregatesInput[]
    NOT?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatMessage"> | string
    conversationId?: StringWithAggregatesFilter<"ChatMessage"> | string
    role?: StringWithAggregatesFilter<"ChatMessage"> | string
    text?: StringWithAggregatesFilter<"ChatMessage"> | string
    source?: EnumChatSourceNullableWithAggregatesFilter<"ChatMessage"> | $Enums.ChatSource | null
    mode?: EnumChatModeNullableWithAggregatesFilter<"ChatMessage"> | $Enums.ChatMode | null
    answersCount?: IntNullableWithAggregatesFilter<"ChatMessage"> | number | null
    finalType?: StringNullableWithAggregatesFilter<"ChatMessage"> | string | null
    meta?: JsonNullableWithAggregatesFilter<"ChatMessage">
    createdAt?: DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string
  }

  export type ConfessionConversationWhereInput = {
    AND?: ConfessionConversationWhereInput | ConfessionConversationWhereInput[]
    OR?: ConfessionConversationWhereInput[]
    NOT?: ConfessionConversationWhereInput | ConfessionConversationWhereInput[]
    id?: StringFilter<"ConfessionConversation"> | string
    userId?: StringNullableFilter<"ConfessionConversation"> | string | null
    title?: StringNullableFilter<"ConfessionConversation"> | string | null
    createdAt?: DateTimeFilter<"ConfessionConversation"> | Date | string
    updatedAt?: DateTimeFilter<"ConfessionConversation"> | Date | string
    messages?: ConfessionMessageListRelationFilter
  }

  export type ConfessionConversationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    messages?: ConfessionMessageOrderByRelationAggregateInput
  }

  export type ConfessionConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConfessionConversationWhereInput | ConfessionConversationWhereInput[]
    OR?: ConfessionConversationWhereInput[]
    NOT?: ConfessionConversationWhereInput | ConfessionConversationWhereInput[]
    userId?: StringNullableFilter<"ConfessionConversation"> | string | null
    title?: StringNullableFilter<"ConfessionConversation"> | string | null
    createdAt?: DateTimeFilter<"ConfessionConversation"> | Date | string
    updatedAt?: DateTimeFilter<"ConfessionConversation"> | Date | string
    messages?: ConfessionMessageListRelationFilter
  }, "id">

  export type ConfessionConversationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ConfessionConversationCountOrderByAggregateInput
    _max?: ConfessionConversationMaxOrderByAggregateInput
    _min?: ConfessionConversationMinOrderByAggregateInput
  }

  export type ConfessionConversationScalarWhereWithAggregatesInput = {
    AND?: ConfessionConversationScalarWhereWithAggregatesInput | ConfessionConversationScalarWhereWithAggregatesInput[]
    OR?: ConfessionConversationScalarWhereWithAggregatesInput[]
    NOT?: ConfessionConversationScalarWhereWithAggregatesInput | ConfessionConversationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ConfessionConversation"> | string
    userId?: StringNullableWithAggregatesFilter<"ConfessionConversation"> | string | null
    title?: StringNullableWithAggregatesFilter<"ConfessionConversation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ConfessionConversation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ConfessionConversation"> | Date | string
  }

  export type ConfessionMessageWhereInput = {
    AND?: ConfessionMessageWhereInput | ConfessionMessageWhereInput[]
    OR?: ConfessionMessageWhereInput[]
    NOT?: ConfessionMessageWhereInput | ConfessionMessageWhereInput[]
    id?: StringFilter<"ConfessionMessage"> | string
    conversationId?: StringFilter<"ConfessionMessage"> | string
    role?: StringFilter<"ConfessionMessage"> | string
    text?: StringFilter<"ConfessionMessage"> | string
    createdAt?: DateTimeFilter<"ConfessionMessage"> | Date | string
    conversation?: XOR<ConfessionConversationScalarRelationFilter, ConfessionConversationWhereInput>
  }

  export type ConfessionMessageOrderByWithRelationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
    conversation?: ConfessionConversationOrderByWithRelationInput
  }

  export type ConfessionMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConfessionMessageWhereInput | ConfessionMessageWhereInput[]
    OR?: ConfessionMessageWhereInput[]
    NOT?: ConfessionMessageWhereInput | ConfessionMessageWhereInput[]
    conversationId?: StringFilter<"ConfessionMessage"> | string
    role?: StringFilter<"ConfessionMessage"> | string
    text?: StringFilter<"ConfessionMessage"> | string
    createdAt?: DateTimeFilter<"ConfessionMessage"> | Date | string
    conversation?: XOR<ConfessionConversationScalarRelationFilter, ConfessionConversationWhereInput>
  }, "id">

  export type ConfessionMessageOrderByWithAggregationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
    _count?: ConfessionMessageCountOrderByAggregateInput
    _max?: ConfessionMessageMaxOrderByAggregateInput
    _min?: ConfessionMessageMinOrderByAggregateInput
  }

  export type ConfessionMessageScalarWhereWithAggregatesInput = {
    AND?: ConfessionMessageScalarWhereWithAggregatesInput | ConfessionMessageScalarWhereWithAggregatesInput[]
    OR?: ConfessionMessageScalarWhereWithAggregatesInput[]
    NOT?: ConfessionMessageScalarWhereWithAggregatesInput | ConfessionMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ConfessionMessage"> | string
    conversationId?: StringWithAggregatesFilter<"ConfessionMessage"> | string
    role?: StringWithAggregatesFilter<"ConfessionMessage"> | string
    text?: StringWithAggregatesFilter<"ConfessionMessage"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ConfessionMessage"> | Date | string
  }

  export type MediaAlbumWhereInput = {
    AND?: MediaAlbumWhereInput | MediaAlbumWhereInput[]
    OR?: MediaAlbumWhereInput[]
    NOT?: MediaAlbumWhereInput | MediaAlbumWhereInput[]
    id?: StringFilter<"MediaAlbum"> | string
    userId?: StringFilter<"MediaAlbum"> | string
    title?: StringFilter<"MediaAlbum"> | string
    createdAt?: DateTimeFilter<"MediaAlbum"> | Date | string
    updatedAt?: DateTimeFilter<"MediaAlbum"> | Date | string
    assets?: MediaAssetListRelationFilter
  }

  export type MediaAlbumOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    assets?: MediaAssetOrderByRelationAggregateInput
  }

  export type MediaAlbumWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MediaAlbumWhereInput | MediaAlbumWhereInput[]
    OR?: MediaAlbumWhereInput[]
    NOT?: MediaAlbumWhereInput | MediaAlbumWhereInput[]
    userId?: StringFilter<"MediaAlbum"> | string
    title?: StringFilter<"MediaAlbum"> | string
    createdAt?: DateTimeFilter<"MediaAlbum"> | Date | string
    updatedAt?: DateTimeFilter<"MediaAlbum"> | Date | string
    assets?: MediaAssetListRelationFilter
  }, "id">

  export type MediaAlbumOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MediaAlbumCountOrderByAggregateInput
    _max?: MediaAlbumMaxOrderByAggregateInput
    _min?: MediaAlbumMinOrderByAggregateInput
  }

  export type MediaAlbumScalarWhereWithAggregatesInput = {
    AND?: MediaAlbumScalarWhereWithAggregatesInput | MediaAlbumScalarWhereWithAggregatesInput[]
    OR?: MediaAlbumScalarWhereWithAggregatesInput[]
    NOT?: MediaAlbumScalarWhereWithAggregatesInput | MediaAlbumScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MediaAlbum"> | string
    userId?: StringWithAggregatesFilter<"MediaAlbum"> | string
    title?: StringWithAggregatesFilter<"MediaAlbum"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MediaAlbum"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MediaAlbum"> | Date | string
  }

  export type MediaAssetWhereInput = {
    AND?: MediaAssetWhereInput | MediaAssetWhereInput[]
    OR?: MediaAssetWhereInput[]
    NOT?: MediaAssetWhereInput | MediaAssetWhereInput[]
    id?: StringFilter<"MediaAsset"> | string
    albumId?: StringFilter<"MediaAsset"> | string
    uri?: StringFilter<"MediaAsset"> | string
    mime?: StringNullableFilter<"MediaAsset"> | string | null
    size?: IntNullableFilter<"MediaAsset"> | number | null
    width?: IntNullableFilter<"MediaAsset"> | number | null
    height?: IntNullableFilter<"MediaAsset"> | number | null
    createdAt?: DateTimeFilter<"MediaAsset"> | Date | string
    album?: XOR<MediaAlbumScalarRelationFilter, MediaAlbumWhereInput>
  }

  export type MediaAssetOrderByWithRelationInput = {
    id?: SortOrder
    albumId?: SortOrder
    uri?: SortOrder
    mime?: SortOrderInput | SortOrder
    size?: SortOrderInput | SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    album?: MediaAlbumOrderByWithRelationInput
  }

  export type MediaAssetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MediaAssetWhereInput | MediaAssetWhereInput[]
    OR?: MediaAssetWhereInput[]
    NOT?: MediaAssetWhereInput | MediaAssetWhereInput[]
    albumId?: StringFilter<"MediaAsset"> | string
    uri?: StringFilter<"MediaAsset"> | string
    mime?: StringNullableFilter<"MediaAsset"> | string | null
    size?: IntNullableFilter<"MediaAsset"> | number | null
    width?: IntNullableFilter<"MediaAsset"> | number | null
    height?: IntNullableFilter<"MediaAsset"> | number | null
    createdAt?: DateTimeFilter<"MediaAsset"> | Date | string
    album?: XOR<MediaAlbumScalarRelationFilter, MediaAlbumWhereInput>
  }, "id">

  export type MediaAssetOrderByWithAggregationInput = {
    id?: SortOrder
    albumId?: SortOrder
    uri?: SortOrder
    mime?: SortOrderInput | SortOrder
    size?: SortOrderInput | SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MediaAssetCountOrderByAggregateInput
    _avg?: MediaAssetAvgOrderByAggregateInput
    _max?: MediaAssetMaxOrderByAggregateInput
    _min?: MediaAssetMinOrderByAggregateInput
    _sum?: MediaAssetSumOrderByAggregateInput
  }

  export type MediaAssetScalarWhereWithAggregatesInput = {
    AND?: MediaAssetScalarWhereWithAggregatesInput | MediaAssetScalarWhereWithAggregatesInput[]
    OR?: MediaAssetScalarWhereWithAggregatesInput[]
    NOT?: MediaAssetScalarWhereWithAggregatesInput | MediaAssetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MediaAsset"> | string
    albumId?: StringWithAggregatesFilter<"MediaAsset"> | string
    uri?: StringWithAggregatesFilter<"MediaAsset"> | string
    mime?: StringNullableWithAggregatesFilter<"MediaAsset"> | string | null
    size?: IntNullableWithAggregatesFilter<"MediaAsset"> | number | null
    width?: IntNullableWithAggregatesFilter<"MediaAsset"> | number | null
    height?: IntNullableWithAggregatesFilter<"MediaAsset"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"MediaAsset"> | Date | string
  }

  export type MatchRequestWhereInput = {
    AND?: MatchRequestWhereInput | MatchRequestWhereInput[]
    OR?: MatchRequestWhereInput[]
    NOT?: MatchRequestWhereInput | MatchRequestWhereInput[]
    id?: StringFilter<"MatchRequest"> | string
    requesterId?: StringFilter<"MatchRequest"> | string
    query?: StringFilter<"MatchRequest"> | string
    mode?: EnumChatModeNullableFilter<"MatchRequest"> | $Enums.ChatMode | null
    createdAt?: DateTimeFilter<"MatchRequest"> | Date | string
    updatedAt?: DateTimeFilter<"MatchRequest"> | Date | string
    status?: EnumMatchRequestStatusFilter<"MatchRequest"> | $Enums.MatchRequestStatus
    approvedCandidateId?: StringNullableFilter<"MatchRequest"> | string | null
    candidates?: MatchCandidateListRelationFilter
  }

  export type MatchRequestOrderByWithRelationInput = {
    id?: SortOrder
    requesterId?: SortOrder
    query?: SortOrder
    mode?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    approvedCandidateId?: SortOrderInput | SortOrder
    candidates?: MatchCandidateOrderByRelationAggregateInput
  }

  export type MatchRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MatchRequestWhereInput | MatchRequestWhereInput[]
    OR?: MatchRequestWhereInput[]
    NOT?: MatchRequestWhereInput | MatchRequestWhereInput[]
    requesterId?: StringFilter<"MatchRequest"> | string
    query?: StringFilter<"MatchRequest"> | string
    mode?: EnumChatModeNullableFilter<"MatchRequest"> | $Enums.ChatMode | null
    createdAt?: DateTimeFilter<"MatchRequest"> | Date | string
    updatedAt?: DateTimeFilter<"MatchRequest"> | Date | string
    status?: EnumMatchRequestStatusFilter<"MatchRequest"> | $Enums.MatchRequestStatus
    approvedCandidateId?: StringNullableFilter<"MatchRequest"> | string | null
    candidates?: MatchCandidateListRelationFilter
  }, "id">

  export type MatchRequestOrderByWithAggregationInput = {
    id?: SortOrder
    requesterId?: SortOrder
    query?: SortOrder
    mode?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    approvedCandidateId?: SortOrderInput | SortOrder
    _count?: MatchRequestCountOrderByAggregateInput
    _max?: MatchRequestMaxOrderByAggregateInput
    _min?: MatchRequestMinOrderByAggregateInput
  }

  export type MatchRequestScalarWhereWithAggregatesInput = {
    AND?: MatchRequestScalarWhereWithAggregatesInput | MatchRequestScalarWhereWithAggregatesInput[]
    OR?: MatchRequestScalarWhereWithAggregatesInput[]
    NOT?: MatchRequestScalarWhereWithAggregatesInput | MatchRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MatchRequest"> | string
    requesterId?: StringWithAggregatesFilter<"MatchRequest"> | string
    query?: StringWithAggregatesFilter<"MatchRequest"> | string
    mode?: EnumChatModeNullableWithAggregatesFilter<"MatchRequest"> | $Enums.ChatMode | null
    createdAt?: DateTimeWithAggregatesFilter<"MatchRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MatchRequest"> | Date | string
    status?: EnumMatchRequestStatusWithAggregatesFilter<"MatchRequest"> | $Enums.MatchRequestStatus
    approvedCandidateId?: StringNullableWithAggregatesFilter<"MatchRequest"> | string | null
  }

  export type MatchCandidateWhereInput = {
    AND?: MatchCandidateWhereInput | MatchCandidateWhereInput[]
    OR?: MatchCandidateWhereInput[]
    NOT?: MatchCandidateWhereInput | MatchCandidateWhereInput[]
    id?: StringFilter<"MatchCandidate"> | string
    requestId?: StringFilter<"MatchCandidate"> | string
    candidateUserId?: StringFilter<"MatchCandidate"> | string
    sourceDocId?: StringNullableFilter<"MatchCandidate"> | string | null
    snippet?: StringNullableFilter<"MatchCandidate"> | string | null
    status?: EnumMatchCandidateStatusFilter<"MatchCandidate"> | $Enums.MatchCandidateStatus
    decidedAt?: DateTimeNullableFilter<"MatchCandidate"> | Date | string | null
    createdAt?: DateTimeFilter<"MatchCandidate"> | Date | string
    request?: XOR<MatchRequestScalarRelationFilter, MatchRequestWhereInput>
  }

  export type MatchCandidateOrderByWithRelationInput = {
    id?: SortOrder
    requestId?: SortOrder
    candidateUserId?: SortOrder
    sourceDocId?: SortOrderInput | SortOrder
    snippet?: SortOrderInput | SortOrder
    status?: SortOrder
    decidedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    request?: MatchRequestOrderByWithRelationInput
  }

  export type MatchCandidateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MatchCandidateWhereInput | MatchCandidateWhereInput[]
    OR?: MatchCandidateWhereInput[]
    NOT?: MatchCandidateWhereInput | MatchCandidateWhereInput[]
    requestId?: StringFilter<"MatchCandidate"> | string
    candidateUserId?: StringFilter<"MatchCandidate"> | string
    sourceDocId?: StringNullableFilter<"MatchCandidate"> | string | null
    snippet?: StringNullableFilter<"MatchCandidate"> | string | null
    status?: EnumMatchCandidateStatusFilter<"MatchCandidate"> | $Enums.MatchCandidateStatus
    decidedAt?: DateTimeNullableFilter<"MatchCandidate"> | Date | string | null
    createdAt?: DateTimeFilter<"MatchCandidate"> | Date | string
    request?: XOR<MatchRequestScalarRelationFilter, MatchRequestWhereInput>
  }, "id">

  export type MatchCandidateOrderByWithAggregationInput = {
    id?: SortOrder
    requestId?: SortOrder
    candidateUserId?: SortOrder
    sourceDocId?: SortOrderInput | SortOrder
    snippet?: SortOrderInput | SortOrder
    status?: SortOrder
    decidedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MatchCandidateCountOrderByAggregateInput
    _max?: MatchCandidateMaxOrderByAggregateInput
    _min?: MatchCandidateMinOrderByAggregateInput
  }

  export type MatchCandidateScalarWhereWithAggregatesInput = {
    AND?: MatchCandidateScalarWhereWithAggregatesInput | MatchCandidateScalarWhereWithAggregatesInput[]
    OR?: MatchCandidateScalarWhereWithAggregatesInput[]
    NOT?: MatchCandidateScalarWhereWithAggregatesInput | MatchCandidateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MatchCandidate"> | string
    requestId?: StringWithAggregatesFilter<"MatchCandidate"> | string
    candidateUserId?: StringWithAggregatesFilter<"MatchCandidate"> | string
    sourceDocId?: StringNullableWithAggregatesFilter<"MatchCandidate"> | string | null
    snippet?: StringNullableWithAggregatesFilter<"MatchCandidate"> | string | null
    status?: EnumMatchCandidateStatusWithAggregatesFilter<"MatchCandidate"> | $Enums.MatchCandidateStatus
    decidedAt?: DateTimeNullableWithAggregatesFilter<"MatchCandidate"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MatchCandidate"> | Date | string
  }

  export type ChatConversationCreateInput = {
    id?: string
    userId?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageCreateNestedManyWithoutConversationInput
  }

  export type ChatConversationUncheckedCreateInput = {
    id?: string
    userId?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ChatConversationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUpdateManyWithoutConversationNestedInput
  }

  export type ChatConversationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ChatConversationCreateManyInput = {
    id?: string
    userId?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatConversationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatConversationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateInput = {
    id?: string
    role: string
    text: string
    source?: $Enums.ChatSource | null
    mode?: $Enums.ChatMode | null
    answersCount?: number | null
    finalType?: string | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    conversation: ChatConversationCreateNestedOneWithoutMessagesInput
  }

  export type ChatMessageUncheckedCreateInput = {
    id?: string
    conversationId: string
    role: string
    text: string
    source?: $Enums.ChatSource | null
    mode?: $Enums.ChatMode | null
    answersCount?: number | null
    finalType?: string | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    source?: NullableEnumChatSourceFieldUpdateOperationsInput | $Enums.ChatSource | null
    mode?: NullableEnumChatModeFieldUpdateOperationsInput | $Enums.ChatMode | null
    answersCount?: NullableIntFieldUpdateOperationsInput | number | null
    finalType?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversation?: ChatConversationUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type ChatMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    source?: NullableEnumChatSourceFieldUpdateOperationsInput | $Enums.ChatSource | null
    mode?: NullableEnumChatModeFieldUpdateOperationsInput | $Enums.ChatMode | null
    answersCount?: NullableIntFieldUpdateOperationsInput | number | null
    finalType?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateManyInput = {
    id?: string
    conversationId: string
    role: string
    text: string
    source?: $Enums.ChatSource | null
    mode?: $Enums.ChatMode | null
    answersCount?: number | null
    finalType?: string | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    source?: NullableEnumChatSourceFieldUpdateOperationsInput | $Enums.ChatSource | null
    mode?: NullableEnumChatModeFieldUpdateOperationsInput | $Enums.ChatMode | null
    answersCount?: NullableIntFieldUpdateOperationsInput | number | null
    finalType?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    source?: NullableEnumChatSourceFieldUpdateOperationsInput | $Enums.ChatSource | null
    mode?: NullableEnumChatModeFieldUpdateOperationsInput | $Enums.ChatMode | null
    answersCount?: NullableIntFieldUpdateOperationsInput | number | null
    finalType?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfessionConversationCreateInput = {
    id?: string
    userId?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ConfessionMessageCreateNestedManyWithoutConversationInput
  }

  export type ConfessionConversationUncheckedCreateInput = {
    id?: string
    userId?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ConfessionMessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConfessionConversationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ConfessionMessageUpdateManyWithoutConversationNestedInput
  }

  export type ConfessionConversationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ConfessionMessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ConfessionConversationCreateManyInput = {
    id?: string
    userId?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConfessionConversationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfessionConversationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfessionMessageCreateInput = {
    id?: string
    role: string
    text: string
    createdAt?: Date | string
    conversation: ConfessionConversationCreateNestedOneWithoutMessagesInput
  }

  export type ConfessionMessageUncheckedCreateInput = {
    id?: string
    conversationId: string
    role: string
    text: string
    createdAt?: Date | string
  }

  export type ConfessionMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversation?: ConfessionConversationUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type ConfessionMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfessionMessageCreateManyInput = {
    id?: string
    conversationId: string
    role: string
    text: string
    createdAt?: Date | string
  }

  export type ConfessionMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfessionMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaAlbumCreateInput = {
    id?: string
    userId: string
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
    assets?: MediaAssetCreateNestedManyWithoutAlbumInput
  }

  export type MediaAlbumUncheckedCreateInput = {
    id?: string
    userId: string
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
    assets?: MediaAssetUncheckedCreateNestedManyWithoutAlbumInput
  }

  export type MediaAlbumUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assets?: MediaAssetUpdateManyWithoutAlbumNestedInput
  }

  export type MediaAlbumUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assets?: MediaAssetUncheckedUpdateManyWithoutAlbumNestedInput
  }

  export type MediaAlbumCreateManyInput = {
    id?: string
    userId: string
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MediaAlbumUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaAlbumUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaAssetCreateInput = {
    id?: string
    uri: string
    mime?: string | null
    size?: number | null
    width?: number | null
    height?: number | null
    createdAt?: Date | string
    album: MediaAlbumCreateNestedOneWithoutAssetsInput
  }

  export type MediaAssetUncheckedCreateInput = {
    id?: string
    albumId: string
    uri: string
    mime?: string | null
    size?: number | null
    width?: number | null
    height?: number | null
    createdAt?: Date | string
  }

  export type MediaAssetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    uri?: StringFieldUpdateOperationsInput | string
    mime?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    album?: MediaAlbumUpdateOneRequiredWithoutAssetsNestedInput
  }

  export type MediaAssetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    albumId?: StringFieldUpdateOperationsInput | string
    uri?: StringFieldUpdateOperationsInput | string
    mime?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaAssetCreateManyInput = {
    id?: string
    albumId: string
    uri: string
    mime?: string | null
    size?: number | null
    width?: number | null
    height?: number | null
    createdAt?: Date | string
  }

  export type MediaAssetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    uri?: StringFieldUpdateOperationsInput | string
    mime?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaAssetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    albumId?: StringFieldUpdateOperationsInput | string
    uri?: StringFieldUpdateOperationsInput | string
    mime?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchRequestCreateInput = {
    id?: string
    requesterId: string
    query: string
    mode?: $Enums.ChatMode | null
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.MatchRequestStatus
    approvedCandidateId?: string | null
    candidates?: MatchCandidateCreateNestedManyWithoutRequestInput
  }

  export type MatchRequestUncheckedCreateInput = {
    id?: string
    requesterId: string
    query: string
    mode?: $Enums.ChatMode | null
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.MatchRequestStatus
    approvedCandidateId?: string | null
    candidates?: MatchCandidateUncheckedCreateNestedManyWithoutRequestInput
  }

  export type MatchRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mode?: NullableEnumChatModeFieldUpdateOperationsInput | $Enums.ChatMode | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumMatchRequestStatusFieldUpdateOperationsInput | $Enums.MatchRequestStatus
    approvedCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    candidates?: MatchCandidateUpdateManyWithoutRequestNestedInput
  }

  export type MatchRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mode?: NullableEnumChatModeFieldUpdateOperationsInput | $Enums.ChatMode | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumMatchRequestStatusFieldUpdateOperationsInput | $Enums.MatchRequestStatus
    approvedCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
    candidates?: MatchCandidateUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type MatchRequestCreateManyInput = {
    id?: string
    requesterId: string
    query: string
    mode?: $Enums.ChatMode | null
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.MatchRequestStatus
    approvedCandidateId?: string | null
  }

  export type MatchRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mode?: NullableEnumChatModeFieldUpdateOperationsInput | $Enums.ChatMode | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumMatchRequestStatusFieldUpdateOperationsInput | $Enums.MatchRequestStatus
    approvedCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MatchRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mode?: NullableEnumChatModeFieldUpdateOperationsInput | $Enums.ChatMode | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumMatchRequestStatusFieldUpdateOperationsInput | $Enums.MatchRequestStatus
    approvedCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MatchCandidateCreateInput = {
    id?: string
    candidateUserId: string
    sourceDocId?: string | null
    snippet?: string | null
    status?: $Enums.MatchCandidateStatus
    decidedAt?: Date | string | null
    createdAt?: Date | string
    request: MatchRequestCreateNestedOneWithoutCandidatesInput
  }

  export type MatchCandidateUncheckedCreateInput = {
    id?: string
    requestId: string
    candidateUserId: string
    sourceDocId?: string | null
    snippet?: string | null
    status?: $Enums.MatchCandidateStatus
    decidedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MatchCandidateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    candidateUserId?: StringFieldUpdateOperationsInput | string
    sourceDocId?: NullableStringFieldUpdateOperationsInput | string | null
    snippet?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchCandidateStatusFieldUpdateOperationsInput | $Enums.MatchCandidateStatus
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    request?: MatchRequestUpdateOneRequiredWithoutCandidatesNestedInput
  }

  export type MatchCandidateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    candidateUserId?: StringFieldUpdateOperationsInput | string
    sourceDocId?: NullableStringFieldUpdateOperationsInput | string | null
    snippet?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchCandidateStatusFieldUpdateOperationsInput | $Enums.MatchCandidateStatus
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchCandidateCreateManyInput = {
    id?: string
    requestId: string
    candidateUserId: string
    sourceDocId?: string | null
    snippet?: string | null
    status?: $Enums.MatchCandidateStatus
    decidedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MatchCandidateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    candidateUserId?: StringFieldUpdateOperationsInput | string
    sourceDocId?: NullableStringFieldUpdateOperationsInput | string | null
    snippet?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchCandidateStatusFieldUpdateOperationsInput | $Enums.MatchCandidateStatus
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchCandidateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    candidateUserId?: StringFieldUpdateOperationsInput | string
    sourceDocId?: NullableStringFieldUpdateOperationsInput | string | null
    snippet?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchCandidateStatusFieldUpdateOperationsInput | $Enums.MatchCandidateStatus
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ChatMessageListRelationFilter = {
    every?: ChatMessageWhereInput
    some?: ChatMessageWhereInput
    none?: ChatMessageWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ChatMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatConversationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatConversationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatConversationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumChatSourceNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatSource | EnumChatSourceFieldRefInput<$PrismaModel> | null
    in?: $Enums.ChatSource[] | ListEnumChatSourceFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ChatSource[] | ListEnumChatSourceFieldRefInput<$PrismaModel> | null
    not?: NestedEnumChatSourceNullableFilter<$PrismaModel> | $Enums.ChatSource | null
  }

  export type EnumChatModeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatMode | EnumChatModeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ChatMode[] | ListEnumChatModeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ChatMode[] | ListEnumChatModeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumChatModeNullableFilter<$PrismaModel> | $Enums.ChatMode | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ChatConversationScalarRelationFilter = {
    is?: ChatConversationWhereInput
    isNot?: ChatConversationWhereInput
  }

  export type ChatMessageCountOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    text?: SortOrder
    source?: SortOrder
    mode?: SortOrder
    answersCount?: SortOrder
    finalType?: SortOrder
    meta?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageAvgOrderByAggregateInput = {
    answersCount?: SortOrder
  }

  export type ChatMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    text?: SortOrder
    source?: SortOrder
    mode?: SortOrder
    answersCount?: SortOrder
    finalType?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageMinOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    text?: SortOrder
    source?: SortOrder
    mode?: SortOrder
    answersCount?: SortOrder
    finalType?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageSumOrderByAggregateInput = {
    answersCount?: SortOrder
  }

  export type EnumChatSourceNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatSource | EnumChatSourceFieldRefInput<$PrismaModel> | null
    in?: $Enums.ChatSource[] | ListEnumChatSourceFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ChatSource[] | ListEnumChatSourceFieldRefInput<$PrismaModel> | null
    not?: NestedEnumChatSourceNullableWithAggregatesFilter<$PrismaModel> | $Enums.ChatSource | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumChatSourceNullableFilter<$PrismaModel>
    _max?: NestedEnumChatSourceNullableFilter<$PrismaModel>
  }

  export type EnumChatModeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatMode | EnumChatModeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ChatMode[] | ListEnumChatModeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ChatMode[] | ListEnumChatModeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumChatModeNullableWithAggregatesFilter<$PrismaModel> | $Enums.ChatMode | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumChatModeNullableFilter<$PrismaModel>
    _max?: NestedEnumChatModeNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ConfessionMessageListRelationFilter = {
    every?: ConfessionMessageWhereInput
    some?: ConfessionMessageWhereInput
    none?: ConfessionMessageWhereInput
  }

  export type ConfessionMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConfessionConversationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConfessionConversationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConfessionConversationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConfessionConversationScalarRelationFilter = {
    is?: ConfessionConversationWhereInput
    isNot?: ConfessionConversationWhereInput
  }

  export type ConfessionMessageCountOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
  }

  export type ConfessionMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
  }

  export type ConfessionMessageMinOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    text?: SortOrder
    createdAt?: SortOrder
  }

  export type MediaAssetListRelationFilter = {
    every?: MediaAssetWhereInput
    some?: MediaAssetWhereInput
    none?: MediaAssetWhereInput
  }

  export type MediaAssetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MediaAlbumCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MediaAlbumMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MediaAlbumMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MediaAlbumScalarRelationFilter = {
    is?: MediaAlbumWhereInput
    isNot?: MediaAlbumWhereInput
  }

  export type MediaAssetCountOrderByAggregateInput = {
    id?: SortOrder
    albumId?: SortOrder
    uri?: SortOrder
    mime?: SortOrder
    size?: SortOrder
    width?: SortOrder
    height?: SortOrder
    createdAt?: SortOrder
  }

  export type MediaAssetAvgOrderByAggregateInput = {
    size?: SortOrder
    width?: SortOrder
    height?: SortOrder
  }

  export type MediaAssetMaxOrderByAggregateInput = {
    id?: SortOrder
    albumId?: SortOrder
    uri?: SortOrder
    mime?: SortOrder
    size?: SortOrder
    width?: SortOrder
    height?: SortOrder
    createdAt?: SortOrder
  }

  export type MediaAssetMinOrderByAggregateInput = {
    id?: SortOrder
    albumId?: SortOrder
    uri?: SortOrder
    mime?: SortOrder
    size?: SortOrder
    width?: SortOrder
    height?: SortOrder
    createdAt?: SortOrder
  }

  export type MediaAssetSumOrderByAggregateInput = {
    size?: SortOrder
    width?: SortOrder
    height?: SortOrder
  }

  export type EnumMatchRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchRequestStatus | EnumMatchRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchRequestStatus[] | ListEnumMatchRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchRequestStatus[] | ListEnumMatchRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchRequestStatusFilter<$PrismaModel> | $Enums.MatchRequestStatus
  }

  export type MatchCandidateListRelationFilter = {
    every?: MatchCandidateWhereInput
    some?: MatchCandidateWhereInput
    none?: MatchCandidateWhereInput
  }

  export type MatchCandidateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MatchRequestCountOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    query?: SortOrder
    mode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    approvedCandidateId?: SortOrder
  }

  export type MatchRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    query?: SortOrder
    mode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    approvedCandidateId?: SortOrder
  }

  export type MatchRequestMinOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    query?: SortOrder
    mode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    approvedCandidateId?: SortOrder
  }

  export type EnumMatchRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchRequestStatus | EnumMatchRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchRequestStatus[] | ListEnumMatchRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchRequestStatus[] | ListEnumMatchRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.MatchRequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMatchRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumMatchRequestStatusFilter<$PrismaModel>
  }

  export type EnumMatchCandidateStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchCandidateStatus | EnumMatchCandidateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchCandidateStatus[] | ListEnumMatchCandidateStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchCandidateStatus[] | ListEnumMatchCandidateStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchCandidateStatusFilter<$PrismaModel> | $Enums.MatchCandidateStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type MatchRequestScalarRelationFilter = {
    is?: MatchRequestWhereInput
    isNot?: MatchRequestWhereInput
  }

  export type MatchCandidateCountOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    candidateUserId?: SortOrder
    sourceDocId?: SortOrder
    snippet?: SortOrder
    status?: SortOrder
    decidedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchCandidateMaxOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    candidateUserId?: SortOrder
    sourceDocId?: SortOrder
    snippet?: SortOrder
    status?: SortOrder
    decidedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchCandidateMinOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    candidateUserId?: SortOrder
    sourceDocId?: SortOrder
    snippet?: SortOrder
    status?: SortOrder
    decidedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumMatchCandidateStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchCandidateStatus | EnumMatchCandidateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchCandidateStatus[] | ListEnumMatchCandidateStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchCandidateStatus[] | ListEnumMatchCandidateStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchCandidateStatusWithAggregatesFilter<$PrismaModel> | $Enums.MatchCandidateStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMatchCandidateStatusFilter<$PrismaModel>
    _max?: NestedEnumMatchCandidateStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ChatMessageCreateNestedManyWithoutConversationInput = {
    create?: XOR<ChatMessageCreateWithoutConversationInput, ChatMessageUncheckedCreateWithoutConversationInput> | ChatMessageCreateWithoutConversationInput[] | ChatMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutConversationInput | ChatMessageCreateOrConnectWithoutConversationInput[]
    createMany?: ChatMessageCreateManyConversationInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type ChatMessageUncheckedCreateNestedManyWithoutConversationInput = {
    create?: XOR<ChatMessageCreateWithoutConversationInput, ChatMessageUncheckedCreateWithoutConversationInput> | ChatMessageCreateWithoutConversationInput[] | ChatMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutConversationInput | ChatMessageCreateOrConnectWithoutConversationInput[]
    createMany?: ChatMessageCreateManyConversationInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ChatMessageUpdateManyWithoutConversationNestedInput = {
    create?: XOR<ChatMessageCreateWithoutConversationInput, ChatMessageUncheckedCreateWithoutConversationInput> | ChatMessageCreateWithoutConversationInput[] | ChatMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutConversationInput | ChatMessageCreateOrConnectWithoutConversationInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutConversationInput | ChatMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: ChatMessageCreateManyConversationInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutConversationInput | ChatMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutConversationInput | ChatMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type ChatMessageUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: XOR<ChatMessageCreateWithoutConversationInput, ChatMessageUncheckedCreateWithoutConversationInput> | ChatMessageCreateWithoutConversationInput[] | ChatMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutConversationInput | ChatMessageCreateOrConnectWithoutConversationInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutConversationInput | ChatMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: ChatMessageCreateManyConversationInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutConversationInput | ChatMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutConversationInput | ChatMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type ChatConversationCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ChatConversationCreateWithoutMessagesInput, ChatConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatConversationCreateOrConnectWithoutMessagesInput
    connect?: ChatConversationWhereUniqueInput
  }

  export type NullableEnumChatSourceFieldUpdateOperationsInput = {
    set?: $Enums.ChatSource | null
  }

  export type NullableEnumChatModeFieldUpdateOperationsInput = {
    set?: $Enums.ChatMode | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ChatConversationUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ChatConversationCreateWithoutMessagesInput, ChatConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatConversationCreateOrConnectWithoutMessagesInput
    upsert?: ChatConversationUpsertWithoutMessagesInput
    connect?: ChatConversationWhereUniqueInput
    update?: XOR<XOR<ChatConversationUpdateToOneWithWhereWithoutMessagesInput, ChatConversationUpdateWithoutMessagesInput>, ChatConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type ConfessionMessageCreateNestedManyWithoutConversationInput = {
    create?: XOR<ConfessionMessageCreateWithoutConversationInput, ConfessionMessageUncheckedCreateWithoutConversationInput> | ConfessionMessageCreateWithoutConversationInput[] | ConfessionMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ConfessionMessageCreateOrConnectWithoutConversationInput | ConfessionMessageCreateOrConnectWithoutConversationInput[]
    createMany?: ConfessionMessageCreateManyConversationInputEnvelope
    connect?: ConfessionMessageWhereUniqueInput | ConfessionMessageWhereUniqueInput[]
  }

  export type ConfessionMessageUncheckedCreateNestedManyWithoutConversationInput = {
    create?: XOR<ConfessionMessageCreateWithoutConversationInput, ConfessionMessageUncheckedCreateWithoutConversationInput> | ConfessionMessageCreateWithoutConversationInput[] | ConfessionMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ConfessionMessageCreateOrConnectWithoutConversationInput | ConfessionMessageCreateOrConnectWithoutConversationInput[]
    createMany?: ConfessionMessageCreateManyConversationInputEnvelope
    connect?: ConfessionMessageWhereUniqueInput | ConfessionMessageWhereUniqueInput[]
  }

  export type ConfessionMessageUpdateManyWithoutConversationNestedInput = {
    create?: XOR<ConfessionMessageCreateWithoutConversationInput, ConfessionMessageUncheckedCreateWithoutConversationInput> | ConfessionMessageCreateWithoutConversationInput[] | ConfessionMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ConfessionMessageCreateOrConnectWithoutConversationInput | ConfessionMessageCreateOrConnectWithoutConversationInput[]
    upsert?: ConfessionMessageUpsertWithWhereUniqueWithoutConversationInput | ConfessionMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: ConfessionMessageCreateManyConversationInputEnvelope
    set?: ConfessionMessageWhereUniqueInput | ConfessionMessageWhereUniqueInput[]
    disconnect?: ConfessionMessageWhereUniqueInput | ConfessionMessageWhereUniqueInput[]
    delete?: ConfessionMessageWhereUniqueInput | ConfessionMessageWhereUniqueInput[]
    connect?: ConfessionMessageWhereUniqueInput | ConfessionMessageWhereUniqueInput[]
    update?: ConfessionMessageUpdateWithWhereUniqueWithoutConversationInput | ConfessionMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: ConfessionMessageUpdateManyWithWhereWithoutConversationInput | ConfessionMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: ConfessionMessageScalarWhereInput | ConfessionMessageScalarWhereInput[]
  }

  export type ConfessionMessageUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: XOR<ConfessionMessageCreateWithoutConversationInput, ConfessionMessageUncheckedCreateWithoutConversationInput> | ConfessionMessageCreateWithoutConversationInput[] | ConfessionMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ConfessionMessageCreateOrConnectWithoutConversationInput | ConfessionMessageCreateOrConnectWithoutConversationInput[]
    upsert?: ConfessionMessageUpsertWithWhereUniqueWithoutConversationInput | ConfessionMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: ConfessionMessageCreateManyConversationInputEnvelope
    set?: ConfessionMessageWhereUniqueInput | ConfessionMessageWhereUniqueInput[]
    disconnect?: ConfessionMessageWhereUniqueInput | ConfessionMessageWhereUniqueInput[]
    delete?: ConfessionMessageWhereUniqueInput | ConfessionMessageWhereUniqueInput[]
    connect?: ConfessionMessageWhereUniqueInput | ConfessionMessageWhereUniqueInput[]
    update?: ConfessionMessageUpdateWithWhereUniqueWithoutConversationInput | ConfessionMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: ConfessionMessageUpdateManyWithWhereWithoutConversationInput | ConfessionMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: ConfessionMessageScalarWhereInput | ConfessionMessageScalarWhereInput[]
  }

  export type ConfessionConversationCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ConfessionConversationCreateWithoutMessagesInput, ConfessionConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ConfessionConversationCreateOrConnectWithoutMessagesInput
    connect?: ConfessionConversationWhereUniqueInput
  }

  export type ConfessionConversationUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ConfessionConversationCreateWithoutMessagesInput, ConfessionConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ConfessionConversationCreateOrConnectWithoutMessagesInput
    upsert?: ConfessionConversationUpsertWithoutMessagesInput
    connect?: ConfessionConversationWhereUniqueInput
    update?: XOR<XOR<ConfessionConversationUpdateToOneWithWhereWithoutMessagesInput, ConfessionConversationUpdateWithoutMessagesInput>, ConfessionConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type MediaAssetCreateNestedManyWithoutAlbumInput = {
    create?: XOR<MediaAssetCreateWithoutAlbumInput, MediaAssetUncheckedCreateWithoutAlbumInput> | MediaAssetCreateWithoutAlbumInput[] | MediaAssetUncheckedCreateWithoutAlbumInput[]
    connectOrCreate?: MediaAssetCreateOrConnectWithoutAlbumInput | MediaAssetCreateOrConnectWithoutAlbumInput[]
    createMany?: MediaAssetCreateManyAlbumInputEnvelope
    connect?: MediaAssetWhereUniqueInput | MediaAssetWhereUniqueInput[]
  }

  export type MediaAssetUncheckedCreateNestedManyWithoutAlbumInput = {
    create?: XOR<MediaAssetCreateWithoutAlbumInput, MediaAssetUncheckedCreateWithoutAlbumInput> | MediaAssetCreateWithoutAlbumInput[] | MediaAssetUncheckedCreateWithoutAlbumInput[]
    connectOrCreate?: MediaAssetCreateOrConnectWithoutAlbumInput | MediaAssetCreateOrConnectWithoutAlbumInput[]
    createMany?: MediaAssetCreateManyAlbumInputEnvelope
    connect?: MediaAssetWhereUniqueInput | MediaAssetWhereUniqueInput[]
  }

  export type MediaAssetUpdateManyWithoutAlbumNestedInput = {
    create?: XOR<MediaAssetCreateWithoutAlbumInput, MediaAssetUncheckedCreateWithoutAlbumInput> | MediaAssetCreateWithoutAlbumInput[] | MediaAssetUncheckedCreateWithoutAlbumInput[]
    connectOrCreate?: MediaAssetCreateOrConnectWithoutAlbumInput | MediaAssetCreateOrConnectWithoutAlbumInput[]
    upsert?: MediaAssetUpsertWithWhereUniqueWithoutAlbumInput | MediaAssetUpsertWithWhereUniqueWithoutAlbumInput[]
    createMany?: MediaAssetCreateManyAlbumInputEnvelope
    set?: MediaAssetWhereUniqueInput | MediaAssetWhereUniqueInput[]
    disconnect?: MediaAssetWhereUniqueInput | MediaAssetWhereUniqueInput[]
    delete?: MediaAssetWhereUniqueInput | MediaAssetWhereUniqueInput[]
    connect?: MediaAssetWhereUniqueInput | MediaAssetWhereUniqueInput[]
    update?: MediaAssetUpdateWithWhereUniqueWithoutAlbumInput | MediaAssetUpdateWithWhereUniqueWithoutAlbumInput[]
    updateMany?: MediaAssetUpdateManyWithWhereWithoutAlbumInput | MediaAssetUpdateManyWithWhereWithoutAlbumInput[]
    deleteMany?: MediaAssetScalarWhereInput | MediaAssetScalarWhereInput[]
  }

  export type MediaAssetUncheckedUpdateManyWithoutAlbumNestedInput = {
    create?: XOR<MediaAssetCreateWithoutAlbumInput, MediaAssetUncheckedCreateWithoutAlbumInput> | MediaAssetCreateWithoutAlbumInput[] | MediaAssetUncheckedCreateWithoutAlbumInput[]
    connectOrCreate?: MediaAssetCreateOrConnectWithoutAlbumInput | MediaAssetCreateOrConnectWithoutAlbumInput[]
    upsert?: MediaAssetUpsertWithWhereUniqueWithoutAlbumInput | MediaAssetUpsertWithWhereUniqueWithoutAlbumInput[]
    createMany?: MediaAssetCreateManyAlbumInputEnvelope
    set?: MediaAssetWhereUniqueInput | MediaAssetWhereUniqueInput[]
    disconnect?: MediaAssetWhereUniqueInput | MediaAssetWhereUniqueInput[]
    delete?: MediaAssetWhereUniqueInput | MediaAssetWhereUniqueInput[]
    connect?: MediaAssetWhereUniqueInput | MediaAssetWhereUniqueInput[]
    update?: MediaAssetUpdateWithWhereUniqueWithoutAlbumInput | MediaAssetUpdateWithWhereUniqueWithoutAlbumInput[]
    updateMany?: MediaAssetUpdateManyWithWhereWithoutAlbumInput | MediaAssetUpdateManyWithWhereWithoutAlbumInput[]
    deleteMany?: MediaAssetScalarWhereInput | MediaAssetScalarWhereInput[]
  }

  export type MediaAlbumCreateNestedOneWithoutAssetsInput = {
    create?: XOR<MediaAlbumCreateWithoutAssetsInput, MediaAlbumUncheckedCreateWithoutAssetsInput>
    connectOrCreate?: MediaAlbumCreateOrConnectWithoutAssetsInput
    connect?: MediaAlbumWhereUniqueInput
  }

  export type MediaAlbumUpdateOneRequiredWithoutAssetsNestedInput = {
    create?: XOR<MediaAlbumCreateWithoutAssetsInput, MediaAlbumUncheckedCreateWithoutAssetsInput>
    connectOrCreate?: MediaAlbumCreateOrConnectWithoutAssetsInput
    upsert?: MediaAlbumUpsertWithoutAssetsInput
    connect?: MediaAlbumWhereUniqueInput
    update?: XOR<XOR<MediaAlbumUpdateToOneWithWhereWithoutAssetsInput, MediaAlbumUpdateWithoutAssetsInput>, MediaAlbumUncheckedUpdateWithoutAssetsInput>
  }

  export type MatchCandidateCreateNestedManyWithoutRequestInput = {
    create?: XOR<MatchCandidateCreateWithoutRequestInput, MatchCandidateUncheckedCreateWithoutRequestInput> | MatchCandidateCreateWithoutRequestInput[] | MatchCandidateUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: MatchCandidateCreateOrConnectWithoutRequestInput | MatchCandidateCreateOrConnectWithoutRequestInput[]
    createMany?: MatchCandidateCreateManyRequestInputEnvelope
    connect?: MatchCandidateWhereUniqueInput | MatchCandidateWhereUniqueInput[]
  }

  export type MatchCandidateUncheckedCreateNestedManyWithoutRequestInput = {
    create?: XOR<MatchCandidateCreateWithoutRequestInput, MatchCandidateUncheckedCreateWithoutRequestInput> | MatchCandidateCreateWithoutRequestInput[] | MatchCandidateUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: MatchCandidateCreateOrConnectWithoutRequestInput | MatchCandidateCreateOrConnectWithoutRequestInput[]
    createMany?: MatchCandidateCreateManyRequestInputEnvelope
    connect?: MatchCandidateWhereUniqueInput | MatchCandidateWhereUniqueInput[]
  }

  export type EnumMatchRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.MatchRequestStatus
  }

  export type MatchCandidateUpdateManyWithoutRequestNestedInput = {
    create?: XOR<MatchCandidateCreateWithoutRequestInput, MatchCandidateUncheckedCreateWithoutRequestInput> | MatchCandidateCreateWithoutRequestInput[] | MatchCandidateUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: MatchCandidateCreateOrConnectWithoutRequestInput | MatchCandidateCreateOrConnectWithoutRequestInput[]
    upsert?: MatchCandidateUpsertWithWhereUniqueWithoutRequestInput | MatchCandidateUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: MatchCandidateCreateManyRequestInputEnvelope
    set?: MatchCandidateWhereUniqueInput | MatchCandidateWhereUniqueInput[]
    disconnect?: MatchCandidateWhereUniqueInput | MatchCandidateWhereUniqueInput[]
    delete?: MatchCandidateWhereUniqueInput | MatchCandidateWhereUniqueInput[]
    connect?: MatchCandidateWhereUniqueInput | MatchCandidateWhereUniqueInput[]
    update?: MatchCandidateUpdateWithWhereUniqueWithoutRequestInput | MatchCandidateUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: MatchCandidateUpdateManyWithWhereWithoutRequestInput | MatchCandidateUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: MatchCandidateScalarWhereInput | MatchCandidateScalarWhereInput[]
  }

  export type MatchCandidateUncheckedUpdateManyWithoutRequestNestedInput = {
    create?: XOR<MatchCandidateCreateWithoutRequestInput, MatchCandidateUncheckedCreateWithoutRequestInput> | MatchCandidateCreateWithoutRequestInput[] | MatchCandidateUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: MatchCandidateCreateOrConnectWithoutRequestInput | MatchCandidateCreateOrConnectWithoutRequestInput[]
    upsert?: MatchCandidateUpsertWithWhereUniqueWithoutRequestInput | MatchCandidateUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: MatchCandidateCreateManyRequestInputEnvelope
    set?: MatchCandidateWhereUniqueInput | MatchCandidateWhereUniqueInput[]
    disconnect?: MatchCandidateWhereUniqueInput | MatchCandidateWhereUniqueInput[]
    delete?: MatchCandidateWhereUniqueInput | MatchCandidateWhereUniqueInput[]
    connect?: MatchCandidateWhereUniqueInput | MatchCandidateWhereUniqueInput[]
    update?: MatchCandidateUpdateWithWhereUniqueWithoutRequestInput | MatchCandidateUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: MatchCandidateUpdateManyWithWhereWithoutRequestInput | MatchCandidateUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: MatchCandidateScalarWhereInput | MatchCandidateScalarWhereInput[]
  }

  export type MatchRequestCreateNestedOneWithoutCandidatesInput = {
    create?: XOR<MatchRequestCreateWithoutCandidatesInput, MatchRequestUncheckedCreateWithoutCandidatesInput>
    connectOrCreate?: MatchRequestCreateOrConnectWithoutCandidatesInput
    connect?: MatchRequestWhereUniqueInput
  }

  export type EnumMatchCandidateStatusFieldUpdateOperationsInput = {
    set?: $Enums.MatchCandidateStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type MatchRequestUpdateOneRequiredWithoutCandidatesNestedInput = {
    create?: XOR<MatchRequestCreateWithoutCandidatesInput, MatchRequestUncheckedCreateWithoutCandidatesInput>
    connectOrCreate?: MatchRequestCreateOrConnectWithoutCandidatesInput
    upsert?: MatchRequestUpsertWithoutCandidatesInput
    connect?: MatchRequestWhereUniqueInput
    update?: XOR<XOR<MatchRequestUpdateToOneWithWhereWithoutCandidatesInput, MatchRequestUpdateWithoutCandidatesInput>, MatchRequestUncheckedUpdateWithoutCandidatesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumChatSourceNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatSource | EnumChatSourceFieldRefInput<$PrismaModel> | null
    in?: $Enums.ChatSource[] | ListEnumChatSourceFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ChatSource[] | ListEnumChatSourceFieldRefInput<$PrismaModel> | null
    not?: NestedEnumChatSourceNullableFilter<$PrismaModel> | $Enums.ChatSource | null
  }

  export type NestedEnumChatModeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatMode | EnumChatModeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ChatMode[] | ListEnumChatModeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ChatMode[] | ListEnumChatModeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumChatModeNullableFilter<$PrismaModel> | $Enums.ChatMode | null
  }

  export type NestedEnumChatSourceNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatSource | EnumChatSourceFieldRefInput<$PrismaModel> | null
    in?: $Enums.ChatSource[] | ListEnumChatSourceFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ChatSource[] | ListEnumChatSourceFieldRefInput<$PrismaModel> | null
    not?: NestedEnumChatSourceNullableWithAggregatesFilter<$PrismaModel> | $Enums.ChatSource | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumChatSourceNullableFilter<$PrismaModel>
    _max?: NestedEnumChatSourceNullableFilter<$PrismaModel>
  }

  export type NestedEnumChatModeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatMode | EnumChatModeFieldRefInput<$PrismaModel> | null
    in?: $Enums.ChatMode[] | ListEnumChatModeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ChatMode[] | ListEnumChatModeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumChatModeNullableWithAggregatesFilter<$PrismaModel> | $Enums.ChatMode | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumChatModeNullableFilter<$PrismaModel>
    _max?: NestedEnumChatModeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumMatchRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchRequestStatus | EnumMatchRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchRequestStatus[] | ListEnumMatchRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchRequestStatus[] | ListEnumMatchRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchRequestStatusFilter<$PrismaModel> | $Enums.MatchRequestStatus
  }

  export type NestedEnumMatchRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchRequestStatus | EnumMatchRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchRequestStatus[] | ListEnumMatchRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchRequestStatus[] | ListEnumMatchRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.MatchRequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMatchRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumMatchRequestStatusFilter<$PrismaModel>
  }

  export type NestedEnumMatchCandidateStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchCandidateStatus | EnumMatchCandidateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchCandidateStatus[] | ListEnumMatchCandidateStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchCandidateStatus[] | ListEnumMatchCandidateStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchCandidateStatusFilter<$PrismaModel> | $Enums.MatchCandidateStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumMatchCandidateStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchCandidateStatus | EnumMatchCandidateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MatchCandidateStatus[] | ListEnumMatchCandidateStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MatchCandidateStatus[] | ListEnumMatchCandidateStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMatchCandidateStatusWithAggregatesFilter<$PrismaModel> | $Enums.MatchCandidateStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMatchCandidateStatusFilter<$PrismaModel>
    _max?: NestedEnumMatchCandidateStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ChatMessageCreateWithoutConversationInput = {
    id?: string
    role: string
    text: string
    source?: $Enums.ChatSource | null
    mode?: $Enums.ChatMode | null
    answersCount?: number | null
    finalType?: string | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageUncheckedCreateWithoutConversationInput = {
    id?: string
    role: string
    text: string
    source?: $Enums.ChatSource | null
    mode?: $Enums.ChatMode | null
    answersCount?: number | null
    finalType?: string | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageCreateOrConnectWithoutConversationInput = {
    where: ChatMessageWhereUniqueInput
    create: XOR<ChatMessageCreateWithoutConversationInput, ChatMessageUncheckedCreateWithoutConversationInput>
  }

  export type ChatMessageCreateManyConversationInputEnvelope = {
    data: ChatMessageCreateManyConversationInput | ChatMessageCreateManyConversationInput[]
    skipDuplicates?: boolean
  }

  export type ChatMessageUpsertWithWhereUniqueWithoutConversationInput = {
    where: ChatMessageWhereUniqueInput
    update: XOR<ChatMessageUpdateWithoutConversationInput, ChatMessageUncheckedUpdateWithoutConversationInput>
    create: XOR<ChatMessageCreateWithoutConversationInput, ChatMessageUncheckedCreateWithoutConversationInput>
  }

  export type ChatMessageUpdateWithWhereUniqueWithoutConversationInput = {
    where: ChatMessageWhereUniqueInput
    data: XOR<ChatMessageUpdateWithoutConversationInput, ChatMessageUncheckedUpdateWithoutConversationInput>
  }

  export type ChatMessageUpdateManyWithWhereWithoutConversationInput = {
    where: ChatMessageScalarWhereInput
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyWithoutConversationInput>
  }

  export type ChatMessageScalarWhereInput = {
    AND?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    OR?: ChatMessageScalarWhereInput[]
    NOT?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    conversationId?: StringFilter<"ChatMessage"> | string
    role?: StringFilter<"ChatMessage"> | string
    text?: StringFilter<"ChatMessage"> | string
    source?: EnumChatSourceNullableFilter<"ChatMessage"> | $Enums.ChatSource | null
    mode?: EnumChatModeNullableFilter<"ChatMessage"> | $Enums.ChatMode | null
    answersCount?: IntNullableFilter<"ChatMessage"> | number | null
    finalType?: StringNullableFilter<"ChatMessage"> | string | null
    meta?: JsonNullableFilter<"ChatMessage">
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
  }

  export type ChatConversationCreateWithoutMessagesInput = {
    id?: string
    userId?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatConversationUncheckedCreateWithoutMessagesInput = {
    id?: string
    userId?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatConversationCreateOrConnectWithoutMessagesInput = {
    where: ChatConversationWhereUniqueInput
    create: XOR<ChatConversationCreateWithoutMessagesInput, ChatConversationUncheckedCreateWithoutMessagesInput>
  }

  export type ChatConversationUpsertWithoutMessagesInput = {
    update: XOR<ChatConversationUpdateWithoutMessagesInput, ChatConversationUncheckedUpdateWithoutMessagesInput>
    create: XOR<ChatConversationCreateWithoutMessagesInput, ChatConversationUncheckedCreateWithoutMessagesInput>
    where?: ChatConversationWhereInput
  }

  export type ChatConversationUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ChatConversationWhereInput
    data: XOR<ChatConversationUpdateWithoutMessagesInput, ChatConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type ChatConversationUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatConversationUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfessionMessageCreateWithoutConversationInput = {
    id?: string
    role: string
    text: string
    createdAt?: Date | string
  }

  export type ConfessionMessageUncheckedCreateWithoutConversationInput = {
    id?: string
    role: string
    text: string
    createdAt?: Date | string
  }

  export type ConfessionMessageCreateOrConnectWithoutConversationInput = {
    where: ConfessionMessageWhereUniqueInput
    create: XOR<ConfessionMessageCreateWithoutConversationInput, ConfessionMessageUncheckedCreateWithoutConversationInput>
  }

  export type ConfessionMessageCreateManyConversationInputEnvelope = {
    data: ConfessionMessageCreateManyConversationInput | ConfessionMessageCreateManyConversationInput[]
    skipDuplicates?: boolean
  }

  export type ConfessionMessageUpsertWithWhereUniqueWithoutConversationInput = {
    where: ConfessionMessageWhereUniqueInput
    update: XOR<ConfessionMessageUpdateWithoutConversationInput, ConfessionMessageUncheckedUpdateWithoutConversationInput>
    create: XOR<ConfessionMessageCreateWithoutConversationInput, ConfessionMessageUncheckedCreateWithoutConversationInput>
  }

  export type ConfessionMessageUpdateWithWhereUniqueWithoutConversationInput = {
    where: ConfessionMessageWhereUniqueInput
    data: XOR<ConfessionMessageUpdateWithoutConversationInput, ConfessionMessageUncheckedUpdateWithoutConversationInput>
  }

  export type ConfessionMessageUpdateManyWithWhereWithoutConversationInput = {
    where: ConfessionMessageScalarWhereInput
    data: XOR<ConfessionMessageUpdateManyMutationInput, ConfessionMessageUncheckedUpdateManyWithoutConversationInput>
  }

  export type ConfessionMessageScalarWhereInput = {
    AND?: ConfessionMessageScalarWhereInput | ConfessionMessageScalarWhereInput[]
    OR?: ConfessionMessageScalarWhereInput[]
    NOT?: ConfessionMessageScalarWhereInput | ConfessionMessageScalarWhereInput[]
    id?: StringFilter<"ConfessionMessage"> | string
    conversationId?: StringFilter<"ConfessionMessage"> | string
    role?: StringFilter<"ConfessionMessage"> | string
    text?: StringFilter<"ConfessionMessage"> | string
    createdAt?: DateTimeFilter<"ConfessionMessage"> | Date | string
  }

  export type ConfessionConversationCreateWithoutMessagesInput = {
    id?: string
    userId?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConfessionConversationUncheckedCreateWithoutMessagesInput = {
    id?: string
    userId?: string | null
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConfessionConversationCreateOrConnectWithoutMessagesInput = {
    where: ConfessionConversationWhereUniqueInput
    create: XOR<ConfessionConversationCreateWithoutMessagesInput, ConfessionConversationUncheckedCreateWithoutMessagesInput>
  }

  export type ConfessionConversationUpsertWithoutMessagesInput = {
    update: XOR<ConfessionConversationUpdateWithoutMessagesInput, ConfessionConversationUncheckedUpdateWithoutMessagesInput>
    create: XOR<ConfessionConversationCreateWithoutMessagesInput, ConfessionConversationUncheckedCreateWithoutMessagesInput>
    where?: ConfessionConversationWhereInput
  }

  export type ConfessionConversationUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ConfessionConversationWhereInput
    data: XOR<ConfessionConversationUpdateWithoutMessagesInput, ConfessionConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type ConfessionConversationUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfessionConversationUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaAssetCreateWithoutAlbumInput = {
    id?: string
    uri: string
    mime?: string | null
    size?: number | null
    width?: number | null
    height?: number | null
    createdAt?: Date | string
  }

  export type MediaAssetUncheckedCreateWithoutAlbumInput = {
    id?: string
    uri: string
    mime?: string | null
    size?: number | null
    width?: number | null
    height?: number | null
    createdAt?: Date | string
  }

  export type MediaAssetCreateOrConnectWithoutAlbumInput = {
    where: MediaAssetWhereUniqueInput
    create: XOR<MediaAssetCreateWithoutAlbumInput, MediaAssetUncheckedCreateWithoutAlbumInput>
  }

  export type MediaAssetCreateManyAlbumInputEnvelope = {
    data: MediaAssetCreateManyAlbumInput | MediaAssetCreateManyAlbumInput[]
    skipDuplicates?: boolean
  }

  export type MediaAssetUpsertWithWhereUniqueWithoutAlbumInput = {
    where: MediaAssetWhereUniqueInput
    update: XOR<MediaAssetUpdateWithoutAlbumInput, MediaAssetUncheckedUpdateWithoutAlbumInput>
    create: XOR<MediaAssetCreateWithoutAlbumInput, MediaAssetUncheckedCreateWithoutAlbumInput>
  }

  export type MediaAssetUpdateWithWhereUniqueWithoutAlbumInput = {
    where: MediaAssetWhereUniqueInput
    data: XOR<MediaAssetUpdateWithoutAlbumInput, MediaAssetUncheckedUpdateWithoutAlbumInput>
  }

  export type MediaAssetUpdateManyWithWhereWithoutAlbumInput = {
    where: MediaAssetScalarWhereInput
    data: XOR<MediaAssetUpdateManyMutationInput, MediaAssetUncheckedUpdateManyWithoutAlbumInput>
  }

  export type MediaAssetScalarWhereInput = {
    AND?: MediaAssetScalarWhereInput | MediaAssetScalarWhereInput[]
    OR?: MediaAssetScalarWhereInput[]
    NOT?: MediaAssetScalarWhereInput | MediaAssetScalarWhereInput[]
    id?: StringFilter<"MediaAsset"> | string
    albumId?: StringFilter<"MediaAsset"> | string
    uri?: StringFilter<"MediaAsset"> | string
    mime?: StringNullableFilter<"MediaAsset"> | string | null
    size?: IntNullableFilter<"MediaAsset"> | number | null
    width?: IntNullableFilter<"MediaAsset"> | number | null
    height?: IntNullableFilter<"MediaAsset"> | number | null
    createdAt?: DateTimeFilter<"MediaAsset"> | Date | string
  }

  export type MediaAlbumCreateWithoutAssetsInput = {
    id?: string
    userId: string
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MediaAlbumUncheckedCreateWithoutAssetsInput = {
    id?: string
    userId: string
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MediaAlbumCreateOrConnectWithoutAssetsInput = {
    where: MediaAlbumWhereUniqueInput
    create: XOR<MediaAlbumCreateWithoutAssetsInput, MediaAlbumUncheckedCreateWithoutAssetsInput>
  }

  export type MediaAlbumUpsertWithoutAssetsInput = {
    update: XOR<MediaAlbumUpdateWithoutAssetsInput, MediaAlbumUncheckedUpdateWithoutAssetsInput>
    create: XOR<MediaAlbumCreateWithoutAssetsInput, MediaAlbumUncheckedCreateWithoutAssetsInput>
    where?: MediaAlbumWhereInput
  }

  export type MediaAlbumUpdateToOneWithWhereWithoutAssetsInput = {
    where?: MediaAlbumWhereInput
    data: XOR<MediaAlbumUpdateWithoutAssetsInput, MediaAlbumUncheckedUpdateWithoutAssetsInput>
  }

  export type MediaAlbumUpdateWithoutAssetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaAlbumUncheckedUpdateWithoutAssetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchCandidateCreateWithoutRequestInput = {
    id?: string
    candidateUserId: string
    sourceDocId?: string | null
    snippet?: string | null
    status?: $Enums.MatchCandidateStatus
    decidedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MatchCandidateUncheckedCreateWithoutRequestInput = {
    id?: string
    candidateUserId: string
    sourceDocId?: string | null
    snippet?: string | null
    status?: $Enums.MatchCandidateStatus
    decidedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MatchCandidateCreateOrConnectWithoutRequestInput = {
    where: MatchCandidateWhereUniqueInput
    create: XOR<MatchCandidateCreateWithoutRequestInput, MatchCandidateUncheckedCreateWithoutRequestInput>
  }

  export type MatchCandidateCreateManyRequestInputEnvelope = {
    data: MatchCandidateCreateManyRequestInput | MatchCandidateCreateManyRequestInput[]
    skipDuplicates?: boolean
  }

  export type MatchCandidateUpsertWithWhereUniqueWithoutRequestInput = {
    where: MatchCandidateWhereUniqueInput
    update: XOR<MatchCandidateUpdateWithoutRequestInput, MatchCandidateUncheckedUpdateWithoutRequestInput>
    create: XOR<MatchCandidateCreateWithoutRequestInput, MatchCandidateUncheckedCreateWithoutRequestInput>
  }

  export type MatchCandidateUpdateWithWhereUniqueWithoutRequestInput = {
    where: MatchCandidateWhereUniqueInput
    data: XOR<MatchCandidateUpdateWithoutRequestInput, MatchCandidateUncheckedUpdateWithoutRequestInput>
  }

  export type MatchCandidateUpdateManyWithWhereWithoutRequestInput = {
    where: MatchCandidateScalarWhereInput
    data: XOR<MatchCandidateUpdateManyMutationInput, MatchCandidateUncheckedUpdateManyWithoutRequestInput>
  }

  export type MatchCandidateScalarWhereInput = {
    AND?: MatchCandidateScalarWhereInput | MatchCandidateScalarWhereInput[]
    OR?: MatchCandidateScalarWhereInput[]
    NOT?: MatchCandidateScalarWhereInput | MatchCandidateScalarWhereInput[]
    id?: StringFilter<"MatchCandidate"> | string
    requestId?: StringFilter<"MatchCandidate"> | string
    candidateUserId?: StringFilter<"MatchCandidate"> | string
    sourceDocId?: StringNullableFilter<"MatchCandidate"> | string | null
    snippet?: StringNullableFilter<"MatchCandidate"> | string | null
    status?: EnumMatchCandidateStatusFilter<"MatchCandidate"> | $Enums.MatchCandidateStatus
    decidedAt?: DateTimeNullableFilter<"MatchCandidate"> | Date | string | null
    createdAt?: DateTimeFilter<"MatchCandidate"> | Date | string
  }

  export type MatchRequestCreateWithoutCandidatesInput = {
    id?: string
    requesterId: string
    query: string
    mode?: $Enums.ChatMode | null
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.MatchRequestStatus
    approvedCandidateId?: string | null
  }

  export type MatchRequestUncheckedCreateWithoutCandidatesInput = {
    id?: string
    requesterId: string
    query: string
    mode?: $Enums.ChatMode | null
    createdAt?: Date | string
    updatedAt?: Date | string
    status?: $Enums.MatchRequestStatus
    approvedCandidateId?: string | null
  }

  export type MatchRequestCreateOrConnectWithoutCandidatesInput = {
    where: MatchRequestWhereUniqueInput
    create: XOR<MatchRequestCreateWithoutCandidatesInput, MatchRequestUncheckedCreateWithoutCandidatesInput>
  }

  export type MatchRequestUpsertWithoutCandidatesInput = {
    update: XOR<MatchRequestUpdateWithoutCandidatesInput, MatchRequestUncheckedUpdateWithoutCandidatesInput>
    create: XOR<MatchRequestCreateWithoutCandidatesInput, MatchRequestUncheckedCreateWithoutCandidatesInput>
    where?: MatchRequestWhereInput
  }

  export type MatchRequestUpdateToOneWithWhereWithoutCandidatesInput = {
    where?: MatchRequestWhereInput
    data: XOR<MatchRequestUpdateWithoutCandidatesInput, MatchRequestUncheckedUpdateWithoutCandidatesInput>
  }

  export type MatchRequestUpdateWithoutCandidatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mode?: NullableEnumChatModeFieldUpdateOperationsInput | $Enums.ChatMode | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumMatchRequestStatusFieldUpdateOperationsInput | $Enums.MatchRequestStatus
    approvedCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MatchRequestUncheckedUpdateWithoutCandidatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mode?: NullableEnumChatModeFieldUpdateOperationsInput | $Enums.ChatMode | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumMatchRequestStatusFieldUpdateOperationsInput | $Enums.MatchRequestStatus
    approvedCandidateId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChatMessageCreateManyConversationInput = {
    id?: string
    role: string
    text: string
    source?: $Enums.ChatSource | null
    mode?: $Enums.ChatMode | null
    answersCount?: number | null
    finalType?: string | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    source?: NullableEnumChatSourceFieldUpdateOperationsInput | $Enums.ChatSource | null
    mode?: NullableEnumChatModeFieldUpdateOperationsInput | $Enums.ChatMode | null
    answersCount?: NullableIntFieldUpdateOperationsInput | number | null
    finalType?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    source?: NullableEnumChatSourceFieldUpdateOperationsInput | $Enums.ChatSource | null
    mode?: NullableEnumChatModeFieldUpdateOperationsInput | $Enums.ChatMode | null
    answersCount?: NullableIntFieldUpdateOperationsInput | number | null
    finalType?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    source?: NullableEnumChatSourceFieldUpdateOperationsInput | $Enums.ChatSource | null
    mode?: NullableEnumChatModeFieldUpdateOperationsInput | $Enums.ChatMode | null
    answersCount?: NullableIntFieldUpdateOperationsInput | number | null
    finalType?: NullableStringFieldUpdateOperationsInput | string | null
    meta?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfessionMessageCreateManyConversationInput = {
    id?: string
    role: string
    text: string
    createdAt?: Date | string
  }

  export type ConfessionMessageUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfessionMessageUncheckedUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfessionMessageUncheckedUpdateManyWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaAssetCreateManyAlbumInput = {
    id?: string
    uri: string
    mime?: string | null
    size?: number | null
    width?: number | null
    height?: number | null
    createdAt?: Date | string
  }

  export type MediaAssetUpdateWithoutAlbumInput = {
    id?: StringFieldUpdateOperationsInput | string
    uri?: StringFieldUpdateOperationsInput | string
    mime?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaAssetUncheckedUpdateWithoutAlbumInput = {
    id?: StringFieldUpdateOperationsInput | string
    uri?: StringFieldUpdateOperationsInput | string
    mime?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaAssetUncheckedUpdateManyWithoutAlbumInput = {
    id?: StringFieldUpdateOperationsInput | string
    uri?: StringFieldUpdateOperationsInput | string
    mime?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchCandidateCreateManyRequestInput = {
    id?: string
    candidateUserId: string
    sourceDocId?: string | null
    snippet?: string | null
    status?: $Enums.MatchCandidateStatus
    decidedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MatchCandidateUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    candidateUserId?: StringFieldUpdateOperationsInput | string
    sourceDocId?: NullableStringFieldUpdateOperationsInput | string | null
    snippet?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchCandidateStatusFieldUpdateOperationsInput | $Enums.MatchCandidateStatus
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchCandidateUncheckedUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    candidateUserId?: StringFieldUpdateOperationsInput | string
    sourceDocId?: NullableStringFieldUpdateOperationsInput | string | null
    snippet?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchCandidateStatusFieldUpdateOperationsInput | $Enums.MatchCandidateStatus
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchCandidateUncheckedUpdateManyWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    candidateUserId?: StringFieldUpdateOperationsInput | string
    sourceDocId?: NullableStringFieldUpdateOperationsInput | string | null
    snippet?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMatchCandidateStatusFieldUpdateOperationsInput | $Enums.MatchCandidateStatus
    decidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}