export type DateType = OpaqueType<"DateType">
export type OpaqueType<T extends string> = string & { __opaque__: T };
export type TimeType = OpaqueType<"TimeType">
export type DateTimeType = OpaqueType<"DateTimeType">
export abstract class CustomError extends Error {
  constructor(message: string, public internalMessage?: string) {
    super();
    this.message = message;
    Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
export class ServerError extends CustomError {
  public static statusCode = 500
  public kind = "ServerError"
  constructor(message: string) {
    super(message);
  }
}
export class NotAllowedError extends CustomError {
  public static statusCode = 405
  public kind = "NotAllowedError"
  constructor(message: string) {
    super(message);
  }
}
export class ForbiddenError extends CustomError {
  public static statusCode = 403
  public kind = "ForbiddenError"
  constructor(message: string) {
    super(message);
  }
}
export class UnauthenticatedError extends CustomError {
  public static statusCode = 401
  public kind = "UnauthenticatedError"
  constructor() {
    super("Unauthenticated");
  }
}
export class NotFoundError extends CustomError {
  public static statusCode = 404
  public kind = "NotFoundError"
  constructor(message: string) {
    super(message);
  }
}
export interface ValidationErrorMessages {
  developer: string;
  friendly?: string;
}
export interface ValidationErrorDetail {
  attribute?: string;
  path: string;
  value: any;
  messages: ValidationErrorMessages;
}
export class ValidationError extends CustomError {
  public static statusCode = 422
  public kind = "ValidationError"
  constructor(public details: ValidationErrorDetail[]) {
    super(`Validation Error${details.length === 1 ? "" : "s"}`);
  }
}
export class ConflictError extends CustomError {
  public static statusCode = 409
  public kind = "ConflictError"
  constructor(message: string) {
    super(message);
  }
}
export class FeatureDisabledError extends CustomError {
  public static statusCode = 503
  public kind = "FeatureDisabledError"
  constructor(message: string) {
    super(message);
  }
}
export class InvalidRequestError extends CustomError {
  public static statusCode = 400
  public kind = "InvalidRequestError"
  constructor(message: string) {
    super(message);
  }
}
export type ServerErrors = CustomError | ServerError | NotAllowedError | ForbiddenError | UnauthenticatedError | NotFoundError | ValidationError | ConflictError | FeatureDisabledError | InvalidRequestError
export type DataId = OpaqueType<"DataId">
/**
 * An actual instance of a data type.
 */
export interface IData extends IDataCore {
  /** A unique identifier specific to the database it is stored in */
  id?: DataId
}
export interface IDataCore extends IDataKeys {
  /** Indicates the date on which it was updated */
  updatedOn?: DateTimeType

  /** Indicates the date on which it was published */
  ////ben
  publishedUpdatedOn?: DateTimeType

  /** Indicates the date on which it was deleted - or NULL if not deleted */
  deletedOn?: DateTimeType
}
export type DataTypeKey = OpaqueType<"DataTypeKey">
export interface IDataKeys extends IDataTypeKeys {
  /** A reference to the type of data that this is an instance of */
  dataTypeKey: DataTypeKey
}
export type DataKey = OpaqueType<"DataKey">
export type LanguageKey = OpaqueType<"LanguageKey">
export type VariantKey = OpaqueType<"VariantKey">
export interface IDataTypeKeys {
  /** The camel cased system name used to identify this individual data instance in the back end, and used as a slug in URLs */
  dataKey: DataKey

  /** The language used in defining this data */
  languageKey: LanguageKey

  /** The variant used in defining this data */
  variantKey: VariantKey
}
export interface IQueryCore {
  dataTypeKey: DataTypeKey
  includeDeleted?: boolean
}
export abstract class QueryCoreBuilder<T extends IData, TQuery extends IQueryCore>{
  constructor(private queryCore: TQuery) { }

  // selectKeys(...fields: (keyof T)[]) {
  //     return this.selectFields(...fields)
  // }

  // selectFields(...fields: string[]) {
  //     if (!this.queryCore.select) {
  //         this.queryCore.select = []
  //     }

  //     this.queryCore.select.push(...fields)
  //     return this
  // }

  public withDeleted(allowDeleted = true) {
    this.queryCore.includeDeleted = allowDeleted
    return this
  }

  public toQuery() {
    return this.queryCore
  }
}
export type QuerySortDirection = "DESC" | "ASC"
export interface IQuerySort {
  field: string
  direction?: QuerySortDirection
}
export interface IQueryPaging {
  take: number
  skip?: number
}
export interface IQuerySearch {
  fields: string[]
  value: string
}
export type QueryOperation = "eq" | "neq" | "between" | "gt" | "lt" | "in" | "array-contains-any" | "array-contains-all"
export interface IQueryWhere {
  field: string
  operation: QueryOperation
  value?: QueryWhereValue
}
export interface IQueryDistinct<T extends IData, K extends keyof T> extends IQueryCore {
  select: K
  where?: IQueryWhere[]
}
export type QueryWhereValue = string | string[] | IQueryDistinct<any, any>
export interface IQueryMany<T extends IData> extends IQueryCore {
  select?: string[]
  sort?: IQuerySort[]
  paging?: IQueryPaging
  search?: IQuerySearch
  where?: IQueryWhere[]
}
export class QueryManyBuilder<T extends IData> extends QueryCoreBuilder<T, IQueryMany<T>>{
  constructor(private queryMany: IQueryMany<T>) {
    super(queryMany)
  }

  public search(fields: string[], value: string) {
    this.queryMany.search = { fields, value }
  }

  public paging(take: number, skip?: number) {
    this.queryMany.paging = { take, skip }
    return this
  }

  public sort(field: Extract<keyof T, string>, direction: QuerySortDirection = "ASC") {
    return this.sortField(field, direction)
  }

  public sortField(field: string, direction: QuerySortDirection = "ASC") {
    if (!this.queryMany.sort) {
      this.queryMany.sort = []
    }
    this.queryMany.sort.push({ field, direction })
    return this
  }

  public where<TSubQuery extends IData>(field: Extract<keyof T, string>, operation: QueryOperation, value: QueryWhereValue) {
    return this.whereField(field, operation, value)
  }

  public whereField<TSubQuery extends IData>(field: string, operation: QueryOperation, value: QueryWhereValue) {
    if (!this.queryMany.where) {
      this.queryMany.where = []
    }
    this.queryMany.where.push({ field, operation, value })
    return this
  }
}
export interface IQueryOne<T extends IData> extends IQueryCore {
  dataKey: DataKey
  select?: string[]
  bypassVariableParsing?: boolean
}
export class QueryOneBuilder<T extends IData> extends QueryCoreBuilder<T, IQueryOne<T>>{
  constructor(private queryOne: IQueryOne<T>) {
    super(queryOne)
  }
}
export class QueryDistinctBuilder<T extends IData, K extends Extract<keyof T, string>> extends QueryCoreBuilder<T, IQueryDistinct<T, K>>{
  constructor(private queryDistinct: IQueryDistinct<T, K>) {
    super(queryDistinct)
  }

  public where<TSubQuery extends IData>(field: Extract<keyof T, string>, operation: QueryOperation, value: QueryWhereValue) {
    return this.whereField(field, operation, value)
  }

  public whereField<TSubQuery extends IData>(field: string, operation: QueryOperation, value: QueryWhereValue) {
    if (!this.queryDistinct.where) {
      this.queryDistinct.where = []
    }
    this.queryDistinct.where.push({ field, operation, value })
    return this
  }
}
export class Queries {
  public static getOne<T extends IData>(cls: new () => T, dataKey: DataKey): IQueryOne<T> {
    return { dataTypeKey: DataAttributes.getKeyFor(cls), dataKey }
  }

  public static getMany<T extends IData>(cls: new () => T): IQueryMany<T> {
    return { dataTypeKey: DataAttributes.getKeyFor(cls) }
  }

  public static getDistinct<T extends IData, K extends keyof T>(cls: new () => T, select: K): IQueryDistinct<T, K> {
    return { dataTypeKey: DataAttributes.getKeyFor(cls), select }
  }
}
export interface IDataQueryClient {
  queryMany<T extends IData>(body: IQueryMany<T>): Promise<T[]>
  queryOne<T extends IData>(body: IQueryOne<T>): Promise<T>
  queryDistinct<T extends IData, K extends Extract<keyof T, string>>(body: IQueryDistinct<T, K>): Promise<Array<T[K]>>
}
export abstract class DataQueryClientBase {
  constructor(private queryClient: IDataQueryClient) { }
  protected many<T extends IData>(cls: new () => T, builder?: (builder: QueryManyBuilder<T>) => QueryManyBuilder<T>): Promise<T[]> {
    const queryMany = new QueryManyBuilder<T>(Queries.getMany(cls))
    return this.queryClient.queryMany((builder ? builder(queryMany) : queryMany).toQuery())
  }

  protected async manyPick<T extends IData, TSelect extends Extract<keyof T, string>>(cls: new () => T, select: TSelect[], builder?: (builder: QueryManyBuilder<T>) => QueryManyBuilder<T>): Promise<Array<Pick<T, TSelect>>> {
    const queryMany = new QueryManyBuilder<T>({ ...Queries.getMany(cls), select })
    const data = await this.queryClient.queryMany((builder ? builder(queryMany) : queryMany).toQuery())
    return data as any as Array<Pick<T, TSelect>>
  }

  protected one<T extends IData>(cls: new () => T, dataKey: DataKey, builder?: (builder: QueryOneBuilder<T>) => QueryOneBuilder<T>): Promise<T> {
    const queryOne = new QueryOneBuilder<T>(Queries.getOne(cls, dataKey))
    return this.queryClient.queryOne((builder ? builder(queryOne) : queryOne).toQuery())
  }

  protected async onePick<T extends IData, TSelect extends Extract<keyof T, string>>(cls: new () => T, dataKey: DataKey, select: TSelect[], builder?: (builder: QueryOneBuilder<T>) => QueryOneBuilder<T>): Promise<Pick<T, TSelect>> {
    const queryOne = new QueryOneBuilder<T>({ ...Queries.getOne(cls, dataKey), select })
    const data = await this.queryClient.queryOne((builder ? builder(queryOne) : queryOne).toQuery())
    return data as any as Pick<T, TSelect>
  }

  protected distinct<T extends IData, K extends Extract<keyof T, string>>(cls: new () => T, select: K, builder?: (builder: QueryDistinctBuilder<T, K>) => QueryDistinctBuilder<T, K>): Promise<Array<T[K]>> {
    const queryDistinct = new QueryDistinctBuilder<T, K>(Queries.getDistinct(cls, select))
    return this.queryClient.queryDistinct((builder ? builder(queryDistinct) : queryDistinct).toQuery())
  }
}
export class DataAttributes {
  static dataItem(key: string): ClassDecorator {
    return (f) => {
      f["___dataKey__"] = key
    };
  }

  static getKeyFor<T extends IData>(cls: new () => T): DataTypeKey {
    return cls["___dataKey__"]
  }
}
export abstract class BaseData implements IData {
  public id?: DataId
  public updatedOn?: DateTimeType
  public deletedOn?: DateTimeType
  public dataTypeKey: DataTypeKey
  public dataKey: DataKey
  public languageKey: LanguageKey
  public variantKey: VariantKey
}
@DataAttributes.dataItem("notification-content")
export class NotificationContent extends BaseData {
  public content: string
}
@DataAttributes.dataItem("notification-fragment-content")
export class NotificationFragmentContent extends BaseData {
  public content: string
}
export class WellKnownEditorKeys {
  public static readonly reference = "reference"
  public static readonly nestedType = "nested-type"
}
export interface IReferenceEditorConfig {
  selected: { dataTypeKey: DataTypeKey, name: string }
}
export class WellKnownDataKeys {
  static multiplicityOne = "page" as DataKey
  static snippets = "snippets" as DataKey
}
export class WellKnownDataTypeKeys {
  static variables = "variables" as DataTypeKey
}
export interface IVariableDataType extends IData {
  variables: { key: string, value: string }[]
}
export type ProfileId = OpaqueType<"ProfileId">
export type RoleId = OpaqueType<"RoleId">
export enum Claims {
  DataTypeEditorClaim = "type-editor",
  DataEditorClaim = "editor",
  DataPublisherClaim = "publisher",
  UserManagerClaim = "users"
}
export interface IUserRole {
  id: RoleId;
  name: string;
  claims: Claims[];
}
export interface IProfile<TMetadata = any> {
  id: ProfileId;
  displayName: string;
  email: string;
  roles: IUserRole[];
  metadata: TMetadata;
}
export interface IDataProtection {
  dataTypeKey: string;
  keys?: string[];
}
export interface IRole {
  id?: RoleId;
  name: string;
  claims: Claims[];
  dataProtection?: IDataProtection[];
}
export interface IUserMetadata {}
export interface INewUserRequest<TMetadata> {
  displayName: string;
  username: string;
  roleIds: RoleId[];
  metadata: TMetadata;
  callbackUrl: string;
}
export interface IVerifyUserRequest {
    username: string;
    password: string;
    verificationToken: string;
}
export interface ILoginRequest {
    username: string;
    password: string;
}
export interface UserProfile {
  id: ProfileId;
  displayName: string;
  email: string;
  claims: Claims[];
}
export interface ILoginResponse {
  profile: UserProfile;
  token: string;
}
export interface IForgotPasswordRequest {
    username: string;
}
export interface IForgotPasswordRequest {
    callbackUrl: string
  }
export interface IResetPasswordRequest {
    username: string;
    password: string;
    passwordResetToken: string;
}
export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IFetcher {
  request<T>(url: string, verb: string, contentType: string, body?: any): Promise<T>
  buildQueryString?(query?: any): string
  requestValidate?(routeUniqueName: string, paramValues: {body?:any, params?: any, query?: any}) : Promise<void>
}

export class Qs {
  static buildQueryStringValue(value: any): string {
    return encodeURIComponent(value)
  }

  static buildQueryString(query?: any, buildQueryStringValue?: (value: any) => string): string {
    if (!query){
      return ""
    }
    const keys = Object.keys(query).filter(k => !!query[k])
    const qs = keys.map(k => encodeURIComponent(k) + "=" + (buildQueryStringValue || Qs.buildQueryStringValue)(query[k])).join("&")
    if (qs){
      return "?" + qs
    }
    return "";
  }
}

function optionalParam(parameter, key: string) {
  return parameter && parameter[key] ? `/${parameter[key]}` : ""
}


export class ProfileController {
  constructor(private fetcher: IFetcher){}

  getAll = async <TMetadata>(): Promise<Array<IProfile<TMetadata>>> => {
    return await this.fetcher.request<Array<IProfile<TMetadata>>>(`/profile`, "get", "application/json")
  }

  update = async <TMetadata>(body: IProfile<TMetadata>): Promise<IProfile<TMetadata>> => {
    return await this.fetcher.request<IProfile<TMetadata>>(`/profile`, "put", "application/json", body)
  }

  getSettings = async (): Promise<string[]> => {
    return await this.fetcher.request<string[]>(`/profile/settings`, "get", "application/json")
  }
}
export class RoleController {
  constructor(private fetcher: IFetcher){}

  getById = async (params: { id: RoleId }): Promise<IRole> => {
    return await this.fetcher.request<IRole>(`/role/${params.id}`, "get", "application/json")
  }

  insert = async (body: IRole): Promise<IRole> => {
    return await this.fetcher.request<IRole>(`/role`, "post", "application/json", body)
  }

  update = async (body: IRole): Promise<IRole> => {
    return await this.fetcher.request<IRole>(`/role`, "put", "application/json", body)
  }
}
export class AuthenticationController {
  constructor(private fetcher: IFetcher){}

  createUser = async (body: INewUserRequest<IUserMetadata>): Promise<void> => {
    return await this.fetcher.request<void>(`/auth/create-user`, "post", "application/json", body)
  }

  verifyUser = async (body: IVerifyUserRequest,query?: { token: string }): Promise<void> => {
    return await this.fetcher.request<void>(`/auth/verify${this.fetcher.buildQueryString(query)}`, "post", "application/json", body)
  }

  login = async (body: ILoginRequest): Promise<ILoginResponse> => {
    return await this.fetcher.request<ILoginResponse>(`/auth/login`, "post", "application/json", body)
  }

  forgotPassword = async (body: IForgotPasswordRequest): Promise<void> => {
    return await this.fetcher.request<void>(`/auth/forgot-password`, "post", "application/json", body)
  }

  resetPassword = async (body: IResetPasswordRequest): Promise<void> => {
    return await this.fetcher.request<void>(`/auth/reset-password`, "post", "application/json", body)
  }

  changePassword = async (body: IChangePassword): Promise<void> => {
    return await this.fetcher.request<void>(`/auth/change-password`, "post", "application/json", body)
  }

  createUserReminder = async (body: { username: string }): Promise<void> => {
    return await this.fetcher.request<void>(`/auth/user-reminder`, "post", "application/json", body)
  }

  rejectUser = async (body: INewUserRequest<IUserMetadata>): Promise<void> => {
    return await this.fetcher.request<void>(`/auth/user-reject`, "post", "application/json", body)
  }
}
export class MetricsController {
  constructor(private fetcher: IFetcher){}

  healthCheck = async (): Promise<void> => {
    return await this.fetcher.request<void>(`/metrics`, "get", "application/json")
  }
}
export class ApiClient {
  constructor(private fetcher: IFetcher){}

  profile = new ProfileController(this.fetcher)

  role = new RoleController(this.fetcher)

  authentication = new AuthenticationController(this.fetcher)

  metrics = new MetricsController(this.fetcher)

}
