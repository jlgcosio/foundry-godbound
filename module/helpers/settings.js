export const SYSTEM = "foundry-godbound";

export const SETTINGS = Object.freeze({
  // optionQuirks: 'optionQuirks',
  // optionZeroPower: 'optionZeroPower',
  // optionCampingRules: 'optionCampingRules',
  // collapseDescriptions: 'collapseDescriptions',
  // experimentalCombatTracker: 'experimentalCombatTracker',
});

export const registerSystemSettings = async function () {
  game.settings.registerMenu(SYSTEM, "myOptionalRules", {
    name: "Optional Rules",
    label: "Manage Optional Rules",
    hint: "Decide what optional rules you would like to include in your world.",
    icon: "fas fa-book",
    type: OptionalRules,
    restricted: true,
  });

  game.settings.register(SYSTEM, SETTINGS.optionQuirks, {
    name: "Enable Quirks?",
    hint: "Play with the Quirk advanced optional rule from Atlas High Fantasy pg 114.",
    scope: "world",
    config: false,
    type: Boolean,
    default: false,
  });
};

class OptionalRules extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template:
        "systems/projectfu/templates/system/settings/optional-rules.hbs",
    });
  }

  getData() {
    let newVar = {
      optionQuirks: game.settings.get(SYSTEM, SETTINGS.optionQuirks),
      optionZeroPower: game.settings.get(SYSTEM, SETTINGS.optionZeroPower),
      optionCampingRules: game.settings.get(
        SYSTEM,
        SETTINGS.optionCampingRules
      ),
    };
    console.log(newVar);
    return newVar;
  }

  async _updateObject(event, formData) {
    const { optionQuirks, optionZeroPower, optionCampingRules } =
      expandObject(formData);
    game.settings.set(SYSTEM, SETTINGS.optionQuirks, optionQuirks);
    game.settings.set(SYSTEM, SETTINGS.optionZeroPower, optionZeroPower);
    game.settings.set(SYSTEM, SETTINGS.optionCampingRules, optionCampingRules);
  }
}
