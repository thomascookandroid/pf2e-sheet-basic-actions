import { PartialBy } from './utils';
import { Rank } from './globals';

export type ActionType = 'A' | 'D' | 'T' | 'F' | 'R' | '';

export interface VariantData {
  label?: string;
  proficiencyKey: string;
  extra?: Record<string, unknown>;
  requiredRank?: Rank;
}

export interface SkillActionData {
  key: string;
  slug: string;
  compendiumId: string;
  icon: string;
  actionType: ActionType;
  variants: VariantData[];
  actor: Actor;
}

export type SkillActionDataParameters = PartialBy<SkillActionData, 'key' | 'actionType' | 'icon' | 'compendiumId'>;

export const SKILL_ACTIONS_DATA: Omit<SkillActionDataParameters, 'actor'>[] = [
  {
    slug: 'stride',
    compendiumId: 'M76ycLAqHoAgbcej',
    actionType: 'A',
    variants: [],
  },
];
