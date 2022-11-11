import type Errorist from '../errorist';

export interface ErrorParser {
  parse(error: unknown): Errorist;
}
