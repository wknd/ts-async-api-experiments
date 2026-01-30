import { combineLatest, EMPTY, map, Observable, startWith } from "rxjs";
import { ErrorA, ErrorB, ErrorC, ErrorD } from "../errors.js";
import {
  PropertyA,
  PropertyB,
  PropertyC,
  PropertyD,
  ResolvedPropertyA,
  ResolvedPropertyB,
  ResolvedPropertyC,
  ResolvedPropertyD,
  ResolvedRoot,
  Root,
} from "./model.js";
import { Result } from "../../models/index.js";

/**
 * D always fails to resolve
 */
export class PropD implements ResolvedPropertyD {
  public async resolve(): Promise<Result.Result<PropertyD, ErrorD>> {
    return Result.err(new ErrorD());
  }

  public resolve$(): Observable<Result.Result<PropertyD, ErrorD>> {
    return EMPTY.pipe(startWith(Result.err(new ErrorD())));
  }
}

/**
 * C always resolves successfully
 */
export class PropC implements ResolvedPropertyC {
  public async resolve(): Promise<Result.Result<PropertyC, ErrorC>> {
    return Result.ok({});
  }

  public resolve$(): Observable<Result.Result<PropertyC, ErrorC>> {
    return EMPTY.pipe(startWith(Result.ok({})));
  }
}

/**
 * creates a single instance of C and caches it
 */
export class PropA implements ResolvedPropertyA {
  public async resolve(): Promise<Result.Result<PropertyA, ErrorA | ErrorC>> {
    const propC = await this.propertyC.resolve();
    if (Result.isErr(propC)) {
      return propC;
    }
    return Result.ok({
      propertyC: propC.result,
    });
  }
  public resolve$(): Observable<Result.Result<PropertyA, ErrorA | ErrorC>> {
    return this.propertyC.resolve$().pipe(
      map((propC) => {
        if (Result.isErr(propC)) {
          return propC;
        }
        return Result.ok({
          propertyC: propC.result,
        });
      }),
    );
  }
  private propCCache?: ResolvedPropertyC;
  public get propertyC(): ResolvedPropertyC {
    if (!this.propCCache) {
      this.propCCache = new PropC();
    }
    return this.propCCache;
  }
}

/**
 * uses a globally cached version of D
 */
export class PropB implements ResolvedPropertyB {
  public async resolve(): Promise<Result.Result<PropertyB, ErrorB | ErrorD>> {
    const propD = await this.propertyD.resolve();
    if (Result.isErr(propD)) {
      return propD;
    }
    return Result.ok({
      propertyD: propD.result,
    });
  }
  public resolve$(): Observable<Result.Result<PropertyB, ErrorB | ErrorD>> {
    return this.propertyD.resolve$().pipe(
      map((propD) => {
        if (Result.isErr(propD)) {
          return propD;
        }
        return Result.ok({
          propertyD: propD.result,
        });
      }),
    );
  }
  private static propDCache: ResolvedPropertyD = new PropD();
  public get propertyD(): ResolvedPropertyD {
    return PropB.propDCache;
  }
}

/**
 * also creates and caches its properties as needed
 */
export class PropRoot implements ResolvedRoot {
  public async resolve(): Promise<
    Result.Result<Root, ErrorA | ErrorB | ErrorC | ErrorD, ErrorB | ErrorD>
  > {
    const propA = await this.propertyA.resolve();
    if (Result.isErr(propA)) {
      return propA;
    }
    const propB = await this.propertyB.resolve();
    if (Result.isErr(propB)) {
      return Result.ok(
        {
          propertyA: propA.result,
        },
        propB.errors,
      );
    }
    return Result.ok({
      propertyA: propA.result,
      propertyB: propB.result,
    });
  }
  public resolve$(): Observable<
    Result.Result<Root, ErrorA | ErrorB | ErrorC | ErrorD, ErrorB | ErrorD>
  > {
    return combineLatest([
      this.propertyA.resolve$(),
      this.propertyB.resolve$(),
    ]).pipe(
      map(([propA, propB]) => {
        if (Result.isErr(propA)) {
          return propA;
        }

        if (Result.isErr(propB)) {
          return Result.ok(
            {
              propertyA: propA.result,
            },
            propB.errors,
          );
        }
        return Result.ok({
          propertyA: propA.result,
          propertyB: propB.result,
        });
      }),
    );
  }
  private propACache?: ResolvedPropertyA;
  public get propertyA(): ResolvedPropertyA {
    if (!this.propACache) {
      this.propACache = new PropA();
    }
    return this.propACache;
  }
  private propBCache?: ResolvedPropertyB;
  public get propertyB(): ResolvedPropertyB {
    if (!this.propBCache) {
      this.propBCache = new PropB();
    }
    return this.propBCache;
  }
}
