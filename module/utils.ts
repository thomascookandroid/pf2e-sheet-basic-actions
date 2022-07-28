import { PF2eActorFlag } from './globals';

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const Flag = {
  set: async function <K extends keyof PF2eActorFlag, V extends PF2eActorFlag[K]>(actor: Actor, key: K, data: V) {
    await actor.setFlag('pf2e-sheet-basic-actions', key, data);
  },
  get: function <K extends keyof PF2eActorFlag>(actor: Actor, key: K): PF2eActorFlag[K] {
    return actor.getFlag('pf2e-sheet-basic-actions', key);
  },
} as const;

export function camelize(value: string): string {
  return value.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
}

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
export function getGame(): Game {
  if (!(game instanceof Game)) {
    throw new Error('game is not initialized yet!');
  }
  return game;
}
