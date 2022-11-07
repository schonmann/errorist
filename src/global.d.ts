type Nullable<T> = T | null;
type Optional<T> = Nullable<T> | undefined;

type Class<T> = new (...args: any[]) => T;

type PromiseReturnType<T> = T extends Promise<infer Return> ? Return : T;

type SyncFunction = (...args: any) => any;

type AsyncFunction <O> = (...args: any) => Promise<O | typeof Error>;
