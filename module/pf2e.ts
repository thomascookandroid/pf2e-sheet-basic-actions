export class ModifierPF2e {
  label: string;
  modifier: number;
  type: string;
  adjustments: Record<string, unknown>[] = [];

  constructor(data: Pick<ModifierPF2e, 'label' | 'modifier' | 'type'>) {
    this.label = data.label;
    this.modifier = data.modifier;
    this.type = data.type;
  }

  update() {
    return undefined;
  }
  test() {
    return undefined;
  }
}
