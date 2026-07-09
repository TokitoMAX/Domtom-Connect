/**
 * territory_config.js
 * Source of truth for geographical ecosystems and localized business fields.
 */

const TerritoryConfig = {
    ecosystems: {
        'OM_FR': {
            label: 'Outre-Mer Français (Antilles, Guyane, Océan Indien)',
            taxIdLabel: 'SIRET / SIREN',
            currency: 'EUR',
            locale: 'fr_FR',
            islands: [
                'Martinique',
                'Guadeloupe',
                'Guyane',
                'Réunion',
                'Mayotte',
                'Saint-Martin',
                'Saint-Barthélemy'
            ]
        },
        'CAR_FR': {
            label: 'Outre-Mer Français (Antilles, Guyane)',
            taxIdLabel: 'SIRET / SIREN',
            currency: 'EUR',
            locale: 'fr_FR',
            islands: ['Martinique', 'Guadeloupe', 'Guyane']
        },
        'PACIFIC_FR': {
            label: 'Espace Pacifique Français',
            taxIdLabel: 'RIDET / SIRET',
            currency: 'XPF',
            locale: 'fr_FR',
            islands: [
                'Nouvelle-Calédonie',
                'Polynésie Française',
                'Wallis-et-Futuna'
            ]
        },
        'CAR_EN': {
            label: 'Anglophone Caribbean',
            taxIdLabel: 'Company Tax ID / Registration #',
            currency: 'USD',
            locale: 'en_US',
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
            currency: 'USD',
            locale: 'es-ES',
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
            currency: 'USD',
            locale: 'en_US',
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
    },

    getLocale(zoneId) {
        const zone = this.ecosystems[zoneId] || this.ecosystems['OM_FR'];
        return zone.locale.replace('_', '-');
    },

    getEcosystem(zoneId) {
        return this.ecosystems[zoneId] || this.ecosystems['OM_FR'];
    },

    getCurrency(zoneId) {
        return this.ecosystems[zoneId] ? this.ecosystems[zoneId].currency : 'EUR';
    },

    getCurrencySymbol(zoneId) {
        const currency = this.getCurrency(zoneId);
        const symbols = { 'EUR': '€', 'USD': '$', 'XPF': 'CFP' };
        return symbols[currency] || '€';
    }
};

if (typeof window !== 'undefined') {
    window.TerritoryConfig = TerritoryConfig;
}
