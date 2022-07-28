import {
  ConfiguredDocumentClass,
  ConstructorDataType,
} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import { ItemData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';
import { Context } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs';
import { BaseActor } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs';
import { ModifierPF2e } from './pf2e';
import { ActorSkillAction } from './skill-actions';

export interface ValuesList<T extends string = string> {
  value: T[];
  custom: string;
}

export interface ItemTraits extends ValuesList {
  rarity: string;
}

export type Rank = 0 | 1 | 2 | 3 | 4;

interface CharacterSkillData {
  label?: string;
  name: string;
  rank: Rank;
  value: number;
  modifiers: ModifierPF2e[];
}

interface BaseActorDataPF2e {
  skills: Record<string, CharacterSkillData>;
}

interface BaseActorSourcePF2e {
  data: BaseActorDataPF2e;
}

interface BaseItemDataPF2e {
  traits?: ItemTraits;
}

interface BaseItemSourcePF2e {
  data: BaseItemDataPF2e;
}

export class ItemPF2e extends Item {
  slug: string | null;
  toChat(event?: JQuery.TriggeredEvent): Promise<undefined>;
}

export type ItemConstructor = new (
  data?: ConstructorDataType<ItemData>,
  context?: Context<InstanceType<ConfiguredDocumentClass<typeof BaseActor>>>,
) => ItemPF2e;

type ActionFunction = (options: { event: JQuery.Event; modifiers: ModifierPF2e[] }) => void;

export interface PF2eActorFlag {
  actions: Record<string, ActorSkillAction>;
  allVisible: boolean;
}

declare global {
  interface DocumentClassConfig {
    Item: typeof ItemPF2e;
  }
  interface DataConfig {
    Actor: BaseActorSourcePF2e;
    Item: BaseItemSourcePF2e;
  }
  interface FlagConfig {
    Actor: {
      ['pf2e-sheet-skill-actions']: PF2eActorFlag;
    };
  }
  interface Game {
    pf2e: { actions: Record<string, ActionFunction> };
  }
}
