/**
 * territory_config.js
 * Source of truth for geographical ecosystems and localized business fields.
 */

const TerritoryConfig = {
    ecosystems: {
        'CAR_FR': {
            label: 'Antilles Françaises (Francophone)',
            taxIdLabel: 'SIRET / SIREN',
            currency: 'EUR',
            islands: [
                'Martinique',
                'Guadeloupe',
                'Guyane',
                'Saint-Martin',
                'Saint-Barthélemy',
                'Réunion',
                'Mayotte'
            ]
        },
        'CAR_EN': {
            label: 'Anglophone Caribbean',
            taxIdLabel: 'Company Tax ID / Registration #',
            currency: 'USD/BBD/Local',
            islands: [
                'Barbados',
                'Jamaica',
                'Antigua & Barbuda',
                'Bahamas',
                'Trinidad & Tobago',
                'St. Lucia',
                'Grenada',
                'Dominica'
            ]
        },
        'CAR_ES': {
            label: 'Ecosistema Hispánico (Caribbean)',
            taxIdLabel: 'RNC / ID Fiscal / Registro',
            currency: 'USD/DOP/Local',
            islands: [
                'República Dominicana',
                'Cuba',
                'Puerto Rico',
                'Panamá',
                'Costa Rica'
            ]
        },
        'INT_DIASPORA': {
            label: 'International & Diaspora',
            taxIdLabel: 'Tax ID / Business ID',
            currency: 'Local Currency',
            islands: [
                'United States',
                'Canada',
                'European Union',
                'United Kingdom',
                'Africa (Central/Western)',
                'Other International'
            ]
        }
    },

    getZones() {
        return Object.keys(this.ecosystems).map(key => ({
            id: key,
            label: this.ecosystems[key].label
        }));
    },

    getIslands(zoneId) {
        return this.ecosystems[zoneId] ? this.ecosystems[zoneId].islands : [];
    },

    getTaxIdLabel(zoneId) {
        return this.ecosystems[zoneId] ? this.ecosystems[zoneId].taxIdLabel : 'Tax ID';
    }
};

if (typeof window !== 'undefined') {
    window.TerritoryConfig = TerritoryConfig;
}
