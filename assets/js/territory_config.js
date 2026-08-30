/**
 * territory_config.js
 * Source of truth for geographical ecosystems and localized business fields.
 */

const TerritoryConfig = {
    ecosystems: {
        'CARAIBES': {
            label: 'Caraïbes (Antilles & Guyane, Îles Caraïbes)',
            taxIdLabel: 'SIRET / SIREN / Tax ID',
            currency: 'EUR',
            locale: 'fr_FR',
            islands: [
                'Guadeloupe (971)',
                'Martinique (972)',
                'Guyane (973)',
                'Saint-Martin (97150)',
                'Saint-Barthélemy (97133)',
                'Haïti',
                'Sainte-Lucie & Caraïbe anglophone',
                'Dominique',
                'Barbade & Trinité-et-Tobago',
                'République Dominicaine & Cuba',
                'Autre île / pays des Caraïbes'
            ]
        },
        'AFRIQUE': {
            label: 'Continent Africain (Afrique de l\'Ouest & Centrale)',
            taxIdLabel: 'Numéro RCCM / NIF / Tax ID',
            currency: 'EUR',
            locale: 'fr_FR',
            islands: [
                'Sénégal (Dakar, etc.)',
                'Côte d\'Ivoire (Abidjan, etc.)',
                'Cameroun (Douala, Yaoundé)',
                'Bénin (Cotonou, etc.)',
                'RDC - République Démocratique du Congo (Kinshasa)',
                'Togo (Lomé)',
                'Mali & Guinée',
                'Gabon & Congo-Brazzaville',
                'Ghana & Nigéria',
                'Autre pays d\'Afrique'
            ]
        },
        'OCEAN_INDIEN': {
            label: 'Océan Indien',
            taxIdLabel: 'SIRET / NIF / Tax ID',
            currency: 'EUR',
            locale: 'fr_FR',
            islands: [
                'La Réunion (974)',
                'Mayotte (976)',
                'Madagascar',
                'Île Maurice',
                'Comores & Seychelles'
            ]
        },
        'PACIFIQUE': {
            label: 'Espace Pacifique',
            taxIdLabel: 'RIDET / SIRET / Tax ID',
            currency: 'XPF',
            locale: 'fr_FR',
            islands: [
                'Nouvelle-Calédonie (988)',
                'Polynésie française (987)',
                'Wallis-et-Futuna (986)'
            ]
        },
        'DIASPORA_HEXAGONE': {
            label: 'Diaspora · France Métropolitaine & Europe',
            taxIdLabel: 'SIRET / SIREN / TVA Intracommunautaire',
            currency: 'EUR',
            locale: 'fr_FR',
            islands: [
                'Paris & Île-de-France',
                'Lyon & Auvergne-Rhône-Alpes',
                'Marseille & Région Sud (PACA)',
                'Bordeaux & Nouvelle-Aquitaine',
                'Toulouse & Occitanie',
                'Nantes & Pays de la Loire',
                'Lille & Hauts-de-France',
                'Autre région (France métropolitaine)',
                'Belgique & Suisse',
                'Royaume-Uni & Reste de l\'Europe'
            ]
        },
        'DIASPORA_MONDE': {
            label: 'Diaspora · Amérique du Nord & International',
            taxIdLabel: 'Business ID / EIN / Tax ID',
            currency: 'USD',
            locale: 'en_US',
            islands: [
                'Canada (Montréal, Québec, etc.)',
                'Canada (Toronto & Rest of Canada)',
                'États-Unis (Miami, Floride)',
                'États-Unis (New York, Atlanta, etc.)',
                'International / Reste du Monde'
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
        const zone = this.ecosystems[zoneId] || this.ecosystems['CARAIBES'];
        return zone.locale.replace('_', '-');
    },

    getEcosystem(zoneId) {
        return this.ecosystems[zoneId] || this.ecosystems['CARAIBES'];
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
