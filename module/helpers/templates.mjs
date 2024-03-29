/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    "systems/foundry-godbound/templates/actor/parts/actor-features.hbs",
    "systems/foundry-godbound/templates/actor/parts/actor-items.hbs",
    "systems/foundry-godbound/templates/actor/parts/actor-spells.hbs",
    "systems/foundry-godbound/templates/actor/parts/actor-effects.hbs",
    // Partials - Actor - PC
    "systems/foundry-godbound/templates/actor/pc/pc-summary.hbs",
    // Item partials
    "systems/foundry-godbound/templates/item/parts/item-effects.hbs",
  ]);
};
