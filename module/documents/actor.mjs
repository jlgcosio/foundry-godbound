import { GODBOUND } from "../helpers/config.mjs";

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class GodboundActor extends Actor {
  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the actor source data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.foundrygodbound || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== "character") return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(systemData.abilities)) {
      // In case of null caused by non-number input
      ability.value = ability.value ?? 10;
      // Clean up ability scores because of bug where ability.value turns into an array when sheet window width is smallest possible size
      ability.value =
        typeof ability.value !== "number" ? ability.value[0] : ability.value;

      ability.mod = this._computePcModifier(ability.value);
      ability.check = 21 - ability.value;
    }

    const hardinessMod =
      systemData.saves.hardiness.source === "str"
        ? systemData.abilities.str.mod
        : systemData.abilities.con.mod;
    const evasionMod =
      systemData.saves.evasion.source === "dex"
        ? systemData.abilities.dex.mod
        : systemData.abilities.int.mod;
    const spiritMod =
      systemData.saves.spirit.source === "wis"
        ? systemData.abilities.wis.mod
        : systemData.abilities.cha.mod;

    systemData.saves = {
      hardiness: {
        ...systemData.saves.hardiness,
        base: 16 - systemData.attributes.level.value - hardinessMod,
        options: [
          {
            value: "str",
            label: game.i18n.localize(GODBOUND.abilities.str),
          },
          {
            value: "con",
            label: game.i18n.localize(GODBOUND.abilities.con),
          },
        ],
      },
      evasion: {
        ...systemData.saves.evasion,
        base: 16 - systemData.attributes.level.value - evasionMod,
        options: [
          {
            value: "dex",
            label: game.i18n.localize(GODBOUND.abilities.dex),
          },
          {
            value: "int",
            label: game.i18n.localize(GODBOUND.abilities.int),
          },
        ],
      },
      spirit: {
        ...systemData.saves.spirit,
        base: 16 - systemData.attributes.level.value - spiritMod,
        options: [
          {
            value: "wis",
            label: game.i18n.localize(GODBOUND.abilities.wis),
          },
          {
            value: "cha",
            label: game.i18n.localize(GODBOUND.abilities.cha),
          },
        ],
      },
    };
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== "npc") return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    systemData.xp = systemData.cr * systemData.cr * 100;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    // Starts off by populating the roll data with `this.system`
    const data = { ...super.getRollData() };

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== "character") return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.attributes.level) {
      data.lvl = data.attributes.level.value ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== "npc") return;

    // Process additional NPC data here.
  }

  /**
   *
   * @param {number} abilityScore
   * @returns {number}
   */
  _computePcModifier(abilityScore = 10) {
    if (abilityScore <= 3) {
      return -3;
    } else if (abilityScore >= 4 && abilityScore <= 5) {
      return -2;
    } else if (abilityScore >= 6 && abilityScore <= 8) {
      return -1;
    } else if (abilityScore >= 9 && abilityScore <= 12) {
      return 0;
    } else if (abilityScore >= 13 && abilityScore <= 15) {
      return 1;
    } else if (abilityScore >= 16 && abilityScore <= 17) {
      return 2;
    } else if (abilityScore == 18) {
      return 3;
    } else if (abilityScore >= 19) {
      return 4;
    }
  }
}
