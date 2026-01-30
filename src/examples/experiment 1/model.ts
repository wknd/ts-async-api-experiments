import { Observable } from "rxjs";
import { Result } from "../../models/index.js";
import { ErrorA, ErrorB, ErrorC, ErrorD } from "../errors.js";

export interface Root {
  readonly propertyA: PropertyA;
  readonly propertyB: PropertyB;
}

export interface PropertyA {
  propertyC: PropertyC;
}

export interface PropertyB {
  propertyD: PropertyD;
}

export interface PropertyC {}
export interface PropertyD {}

export interface ResolvedRoot {
  resolve(): Promise<Result.Result<Root, ErrorA | ErrorB | ErrorC | ErrorD>>;

  resolve$(): Observable<
    Result.Result<Root, ErrorA | ErrorB | ErrorC | ErrorD>
  >;

  readonly propertyA: ResolvedPropertyA;
  readonly propertyB: ResolvedPropertyB;
}

export interface ResolvedPropertyA {
  resolve(): Promise<Result.Result<PropertyA, ErrorA | ErrorC>>;
  resolve$(): Observable<Result.Result<PropertyA, ErrorA | ErrorC>>;
  readonly propertyC: ResolvedPropertyC;
}

export interface ResolvedPropertyC {
  resolve(): Promise<Result.Result<PropertyC, ErrorC>>;
  resolve$(): Observable<Result.Result<PropertyC, ErrorC>>;
}

export interface ResolvedPropertyB {
  resolve(): Promise<Result.Result<PropertyB, ErrorB | ErrorD>>;
  resolve$(): Observable<Result.Result<PropertyB, ErrorB | ErrorD>>;
  readonly propertyD: ResolvedPropertyD;
}

export interface ResolvedPropertyD {
  resolve(): Promise<Result.Result<PropertyD, ErrorD>>;
  resolve$(): Observable<Result.Result<PropertyD, ErrorD>>;
}
