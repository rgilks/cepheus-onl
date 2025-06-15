import { ApplicationCommandOptionType } from 'discord-api-types/v10';

export const command = {
  name: 'equipment',
  description: 'Browse equipment from the Cepheus Engine SRD.',
  options: [
    {
      name: 'category',
      description: 'The category of equipment to browse.',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'Armor', value: 'armor' },
        { name: 'Communicators', value: 'communicators' },
        { name: 'Computers', value: 'computers' },
        { name: 'Software', value: 'software' },
        { name: 'Drugs', value: 'drugs' },
        { name: 'Explosives', value: 'explosives' },
        { name: 'Personal Devices', value: 'personalDevices' },
        { name: 'Sensory Aids', value: 'sensoryAids' },
        { name: 'Shelters', value: 'shelters' },
        { name: 'Survival Equipment', value: 'survivalEquipment' },
        { name: 'Tool Kits', value: 'toolKits' },
        { name: 'Melee Weapons', value: 'meleeWeapons' },
        { name: 'Ranged Weapons', value: 'rangedWeapons' },
        { name: 'Ammo', value: 'ammo' },
        { name: 'Accessories', value: 'accessories' },
        { name: 'Grenades', value: 'grenades' },
        { name: 'Heavy Weapons', value: 'heavyWeapons' },
      ],
    },
  ],
};
