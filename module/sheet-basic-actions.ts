/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your module.
 */

// Import TypeScript modules
import { registerSettings, BASIC_ACTIONS_MODULE_NAME } from './settings';
import { preloadTemplates } from './preloadTemplates';
import { ActionsIndex } from './actions-index';
import { Flag, getGame } from './utils';
import { BasicActionCollection } from './basic-actions';

let templates: Handlebars.TemplateDelegate[];

// Initialize module
Hooks.once('init', async () => {
  console.log('pf2e-sheet-basic-actions | Initializing pf2e-sheet-basic-actions');

  // Assign custom classes and constants here

  // Register custom module settings
  registerSettings();

  // Preload Handlebars templates
  templates = await preloadTemplates();
});

Hooks.once('ready', async () => {
  await ActionsIndex.instance.loadCompendium('pf2e.feats-srd');
  await ActionsIndex.instance.loadCompendium('pf2e.actionspf2e');
});

Hooks.once('babele.ready', async () => {
  //Reload actions to have translated actions
  await ActionsIndex.instance.loadCompendium('pf2e.feats-srd');
  await ActionsIndex.instance.loadCompendium('pf2e.actionspf2e');
});

function renderActionsList(basicActions: BasicActionCollection, actor: Actor) {
  const allVisible = Flag.get(actor, 'allVisible');

  const actionData = basicActions
    .map((action) => action.getData({ allVisible }))
    .sort((a, b) => {
      return a.label > b.label ? 1 : -1;
    });

  const $actionActions = $(templates[0]({ actions: actionData, allVisible: allVisible }));
  const $items = $actionActions.find('li.item');

  $actionActions.on('click', '.toggle-hidden-actions', function (e) {
    if (e.altKey) actionActions.toggleVisibility();
    else Flag.set(actor, 'allVisible', !Flag.get(actor, 'allVisible'));
  });

  $actionActions.on('input', 'input[name="filter"]', function (e) {
    const filter = e.currentTarget.value.toLowerCase();
    $items.each(function () {
      const action = actionActions.fromElement(this);
      $(this).toggle(action.isDisplayed(filter, allVisible));
    });
  });

  $items.on('click', '.basic-action.tag.variant-strike', function (e) {
    actionActions.fromEvent(e).rollBasicAction(e);
  });

  $items.on('click', '.item-image', function (e) {
    actionActions.fromEvent(e).toChat();
  });

  $items.on('click', '.item-toggle-equip', function (e) {
    e.stopPropagation();
    actionActions.fromEvent(e).toggleVisibility();
  });

  $items.on('click', '.action-name', function (e) {
    actionActions.fromEvent(e).toggleItemSummary($(e.delegateTarget));
  });

  return $actionActions;
}

// Add any additional hooks if necessary
Hooks.on('renderActorSheet', (app: ActorSheet, html: JQuery<HTMLElement>) => {
  if (app.actor.type !== 'character') return;

  const encounterActions = new BasicActionCollection();
  const explorationActions = new BasicActionCollection();
  const downtimeActions = new BasicActionCollection();

  BasicActionCollection.allActionsFor(app.actor).forEach(function (action) {
    if (action.hasTrait('downtime')) downtimeActions.add(action);
    else if (action.hasTrait('exploration')) explorationActions.add(action);
    else encounterActions.add(action);
  });

  const $encounter = renderActionsList(encounterActions, app.actor);
  const $exploration = renderActionsList(explorationActions, app.actor);
  const $downtime = renderActionsList(downtimeActions, app.actor);

  switch (getGame().settings.get(BASIC_ACTIONS_MODULE_NAME, 'Position')) {
    case 'top': {
      html.find('.actions-list.item-list.directory-list.strikes-list').after($encounter);
      html.find('[data-tab="exploration"] .actions-list.item-list.directory-list').before($exploration);
      html.find('[data-tab="downtime"] .actions-list.item-list.directory-list').before($downtime);
      break;
    }
    case 'bot': {
      html.find('.actions-panel.active').append($encounter);
      html.find('[data-tab="exploration"] .actions-list.item-list.directory-list').after($exploration);
      html.find('[data-tab="downtime"] .actions-list.item-list.directory-list').after($downtime);
      break;
    }
    default: {
      html.find('.actions-list.item-list.directory-list.strikes-list').after($encounter);
      html.find('[data-tab="exploration"] .actions-list.item-list.directory-list').before($exploration);
      html.find('[data-tab="downtime"] .actions-list.item-list.directory-list').before($downtime);
      break;
    }
  }
});
