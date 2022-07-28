import { PartialBy } from './utils';
import { Rank } from './globals';

export type ActionType = 'A' | 'D' | 'T' | 'F' | 'R' | '';

export interface VariantData {
  label?: string;
  proficiencyKey: string;
  extra?: Record<string, unknown>;
  requiredRank?: Rank;
}

export interface BasicActionData {
  key: string;
  slug: string;
  compendiumId: string;
  icon: string;
  actionType: ActionType;
  variants: VariantData[];
  actor: Actor;
}

export type BasicActionDataParameters = PartialBy<BasicActionData, 'key' | 'actionType' | 'icon' | 'compendiumId'>;

export const BASIC_ACTIONS_DATA: Omit<BasicActionDataParameters, 'actor'>[] = [
  {
    slug: 'stride',
    compendiumId: 'M76ycLAqHoAgbcej',
    actionType: 'A',
    variants: [],
  },
];
