export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
  const templatePaths: string[] = [
    // Add paths to "modules/sheet-basic-actions/templates"
    'modules/pf2e-sheet-basic-actions/templates/basic-actions.html',
  ];

  return loadTemplates(templatePaths);
}
