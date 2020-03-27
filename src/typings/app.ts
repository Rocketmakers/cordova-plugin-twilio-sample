import { IFormValidationResult } from '@rocketmakers/armstrong';

export interface ITransitProcess<T> {
  data?: T;
  error?: any;
  validationErrors?: IFormValidationResult[];
}

export interface ICreationProcess<T> extends ITransitProcess<T> {
  stage?: "creating" | "sending" | "error" | "complete";
}

export interface IUpdateProcess<T> extends ITransitProcess<T> {
  stage?: "updating" | "sending" | "error" | "complete";
  sourceId?: string;
}
