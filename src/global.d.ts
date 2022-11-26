type Nullable<T> = T | null;

type Optional<T> = Nullable<T> | undefined;

type Type<T> = { new (...args: any[]): T; };
