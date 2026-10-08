/**
 * DOMTOM CONNECT — MOTEUR D'ANAMNÈSE CLINIQUE TRILINGUE (FR · EN · ES)
 * 10 Actes d'auscultation chirurgicale, adaptation par stade (idee/lancement/installe),
 * syntaxe territoriale grammaticalement correcte, intégration WhatsApp.
 * DA officielle : 100% Noir (#020617), Blanc (#ffffff), Vert émeraude (#10b981).
 * Zéro orange. Zéro émoji. Typographie statutaire.
 */

document.addEventListener('DOMContentLoaded', () => {

    // =====================================================================
    // UTILITAIRE : Extraction du nom propre du territoire et préposition
    // Produit "en Martinique", "au Sénégal", "à La Réunion" (pas "à Martinique (972)")
    // =====================================================================
    function getTerritoryName(raw) {
        if (!raw) return raw;
        // Supprime le code postal entre parenthèses
        return raw.replace(/\s*\([^)]*\)/g, '').replace(/^Diaspora\s*[·]\s*/i, 'Diaspora — ').trim();
    }

    function getTerritoryPrep(raw, lang) {
        if (!raw) return raw;
        const name = getTerritoryName(raw);
        if (lang === 'en' || lang === 'es') return name; // English & Spanish: no grammatical article needed
        const lower = name.toLowerCase();

        // Règles francophones rigoureuses
        const auTerritories = ['sénégal','mali','cameroun','bénin','togo','gabon','maroc','canada','québec','congo'];
        const aTerritories  = ['la réunion','madagascar','la barbade','cuba','haïti','paris','bordeaux','toulouse','lille','nantes','marseille','lyon','abidjan'];
        const enTerritories = ['martinique','guadeloupe','guyane','france','belgique','suisse','afrique','polynésie','calédonie','mayotte','côte','diaspora'];

        for (const t of auTerritories) { if (lower.includes(t)) return `au ${name}`; }
        for (const t of aTerritories)  { if (lower.includes(t)) return `à ${name}`; }
        for (const t of enTerritories) { if (lower.includes(t)) return `en ${name}`; }

        // Fallback intelligent
        if (/^(a|e|i|o|u|é|è)/i.test(name)) return `en ${name}`;
        return `en ${name}`;
    }

    // Dictionnaire de traductions pour l'interface globale
    const UI_TRANSLATIONS = {
        fr: {
            sessionBadge: "Session à huis clos",
            leadTag: "Édition spéciale · Première séance",
            mainTitle: "Votre bilan entrepreneur.",
            prologue1: "Dans une vraie session de coaching, le coach commence toujours par une seule chose : poser les bonnes questions, sans ménagement, pour comprendre où vous en êtes réellement.",
            prologue2: "Ce bilan n'est ni un quiz flatteur, ni une checklist superficielle. C'est une confrontation directe avec vos vraies habitudes de travail et les réalités économiques de votre terrain.",
            warning: "Si vous cherchez des encouragements polis pour justifier votre immobilité, quittez cette page. Si vous êtes prêt à regarder la vérité en face, sélectionnez votre territoire et commencez votre bilan.",
            setupTitle: "Calibrage de votre session",
            setupDesc: "Un commerce physique en Martinique, un cabinet à Abidjan ou une entreprise à la Barbade n'ont ni les mêmes marges, ni les mêmes défis. Renseignez votre profil réel :",
            lblTerritory: "1. Votre territoire d'ancrage",
            lblBusinessType: "2. Nature de votre activité",
            lblBusinessStage: "3. Stade d'avancement réel",
            btnStart: "Commencer le bilan (10 questions)",
            stepLabel: "Question",
            ofLabel: "sur",
            mirrorTitle: "Le regard du coach",
            btnNext: "Question suivante",
            captureTag: "Bilan complété",
            captureTitle: "Votre profil a été établi.",
            captureDesc: "L'analyse de vos réponses pour votre territoire a permis d'identifier précisément votre frein dominant. Renseignez votre identité pour recevoir votre plan d'action personnalisé :",
            lblFirstName: "Prénom",
            lblLastName: "Nom (optionnel)",
            lblEmail: "Adresse e-mail",
            lblPhone: "Téléphone / WhatsApp (optionnel)",
            lblPhonePlaceholder: "Ex : 0696 00 00 00 ou +596 000 000",
            btnUnlock: "Recevoir mon plan d'action",
            privacyNote: "Vos données sont strictement confidentielles. Aucun démarchage abusif ne sera toléré.",
            btnSubmitting: "Génération de votre plan d'action...",
            reportHeader: "Votre profil entrepreneur",
            prescriptionHeader: "Plan d'action immédiat · Les trois priorités",
            solutionsTag: "La suite du parcours",
            solutionsTitle: "Sortir de l'impasse : vos leviers d'action.",
            solutionsDesc: "Le bilan est posé. La prise de conscience reste stérile sans application concrète. Deux voies s'offrent à vous selon votre niveau d'autonomie.",
            tier1Tag: "Fondations et esprit de terrain",
            tier1Title: "Les Fondamentaux de l'Entrepreneur",
            tier1Desc: "41 pages d'écriture dense sans complaisance pour nettoyer vos illusions, déraciner le syndrome de l'imposteur local et signer vos premiers contrats sans capital initial.",
            tier1Btn: "Obtenir le livre (5 €)",
            tier2Tag: "Exécution méthodique et outils d'action",
            tier2Title: "Ebook interactif et boîte à outils",
            tier2Desc: "L'application web complète avec simulateur financier de rentabilité, carnet de bord sauvegardé et génération de votre feuille de route terrain sur trente jours.",
            tier2Btn: "Accéder aux outils (27 €)",
            coachingTag: "Accompagnement · Coaching de terrain",
            coachingTitle: "Besoin d'un copilote pour avancer plus vite ?",
            coachingDesc: "Les outils digitaux vous donnent l'autonomie et la méthode. Mais si votre situation exige un regard extérieur direct, un cadrage financier sur-mesure et un suivi rapproché sur votre territoire, nos programmes d'accompagnement prennent le relais.",
            coachingBtn: "Découvrir l'accompagnement",
            viewCatalog: "Consulter l'ensemble de la librairie et des programmes Domtom Connect →",
            whatsappGroupTag: "Communauté Domtom Connect",
            whatsappGroupTitleIdea: "Rejoindre le groupe des porteurs de projets",
            whatsappGroupDescIdea: "Entourez-vous d'entrepreneurs qui démarrent. Échangez, trouvez des associés sérieux, partagez vos premières avancées dans un espace de rigueur et d'entraide.",
            whatsappGroupTitleActive: "Rejoindre le réseau des entreprises actives",
            whatsappGroupDescActive: "Accédez au réseau des entrepreneurs déjà en activité : opportunités d'affaires, retours d'expérience, décisions stratégiques partagées entre pairs qui agissent.",
            whatsappGroupBtn: "Rejoindre le groupe WhatsApp"
        },
        en: {
            sessionBadge: "Private Coaching Session",
            leadTag: "Special Edition · First Session",
            mainTitle: "Your Entrepreneur Assessment.",
            prologue1: "In a real coaching session, the coach always starts with one thing: asking the right questions, without sugarcoating, to understand where you truly stand.",
            prologue2: "This assessment is neither a flattering quiz nor a shallow marketing checklist. It is a direct confrontation with your real work habits and the financial realities of your market.",
            warning: "If you seek polite encouragement to justify inaction, exit this page immediately. If you are ready to face reality without excuses, select your territory and begin your assessment.",
            setupTitle: "Session Calibration",
            setupDesc: "A brick-and-mortar store in Jamaica, a consultancy in London, or an import venture in Ghana face vastly different margins and challenges. Configure your real profile:",
            lblTerritory: "1. Your Primary Territory or Base",
            lblBusinessType: "2. Business Model & Activity",
            lblBusinessStage: "3. Actual Stage of Business",
            btnStart: "Begin Assessment (10 Questions)",
            stepLabel: "Question",
            ofLabel: "of",
            mirrorTitle: "Coach's Take",
            btnNext: "Next Question",
            captureTag: "Assessment Complete",
            captureTitle: "Your profile has been established.",
            captureDesc: "Our analysis of your answers has identified your dominant blocker. Enter your details to receive your personalized action plan:",
            lblFirstName: "First Name",
            lblLastName: "Last Name (Optional)",
            lblEmail: "Email Address",
            lblPhone: "Phone / WhatsApp (Optional)",
            lblPhonePlaceholder: "E.g. +1 876 000 0000 or +44 7700 000000",
            btnUnlock: "Get My Action Plan",
            privacyNote: "Your data is strictly confidential. Zero spam or aggressive sales tactics.",
            btnSubmitting: "Generating your action plan...",
            reportHeader: "Your Entrepreneur Profile",
            prescriptionHeader: "Immediate Action Plan · Three Key Priorities",
            solutionsTag: "Next Steps",
            solutionsTitle: "Breaking the Deadlock: Your Action Pathways.",
            solutionsDesc: "The assessment is done. Awareness is useless without disciplined execution. Two options are available based on your required level of support.",
            tier1Tag: "Field Foundations & Mindset",
            tier1Title: "The Entrepreneur's Fundamentals",
            tier1Desc: "Dense, uncompromising field playbook to strip away corporate illusions, defeat local imposter syndrome, and secure your first clients with zero initial capital.",
            tier1Btn: "Get the Book (€5)",
            tier2Tag: "Methodical Execution & Tooling",
            tier2Title: "Interactive Ebook & Action Toolkit",
            tier2Desc: "Complete web application featuring financial profitability simulators, saved strategic workbooks, and custom 30-day field roadmaps.",
            tier2Btn: "Access the Toolkit (€27)",
            coachingTag: "Coaching · Field Direction",
            coachingTitle: "Need a Field Co-pilot to Move Faster?",
            coachingDesc: "Digital toolkits grant autonomy and structure. However, if your venture demands direct strategic oversight, customized financial modeling, and on-the-ground guidance, our coaching programs step in.",
            coachingBtn: "Explore Coaching Programs",
            viewCatalog: "Explore the full Domtom Connect library and programs →",
            whatsappGroupTag: "Domtom Connect Community",
            whatsappGroupTitleIdea: "Join the Founders & Project Starters Group",
            whatsappGroupDescIdea: "Surround yourself with founders who are building from zero. Share first wins, find serious co-founders, and hold each other accountable in a high-standard peer group.",
            whatsappGroupTitleActive: "Join the Active Business Owners Network",
            whatsappGroupDescActive: "Enter the network of entrepreneurs already generating revenue: business opportunities, honest experience sharing, and strategic decisions made between peers who execute.",
            whatsappGroupBtn: "Join the WhatsApp Group"
        },
        es: {
            sessionBadge: "Sesión de Coaching Privada",
            leadTag: "Edición Especial · Primera Sesión",
            mainTitle: "Su diagnóstico emprendedor.",
            prologue1: "En una sesión de coaching real, el coach siempre empieza por una sola cosa: hacer las preguntas correctas, sin rodeos, para entender dónde se encuentra realmente.",
            prologue2: "Este diagnóstico no es un test complaciente ni una lista superficial. Es una confrontación directa con sus verdaderos hábitos de gestión y las realidades económicas de su territorio.",
            warning: "Si busca elogios corteses para justificar la inacción, cierre esta página. Si está preparado para confrontar la realidad con honestidad absoluta, seleccione su territorio y comience.",
            setupTitle: "Calibración de su Sesión",
            setupDesc: "Un comercio físico en República Dominicana, una consultoría en Madrid o un negocio en Cuba no enfrentan los mismos márgenes ni los mismos retos. Indique su perfil real:",
            lblTerritory: "1. Su territorio de implantación",
            lblBusinessType: "2. Naturaleza de su actividad",
            lblBusinessStage: "3. Etapa real de su proyecto",
            btnStart: "Comenzar el Diagnóstico (10 Preguntas)",
            stepLabel: "Pregunta",
            ofLabel: "de",
            mirrorTitle: "La perspectiva del coach",
            btnNext: "Siguiente Pregunta",
            captureTag: "Diagnóstico Completado",
            captureTitle: "Su perfil ha sido establecido.",
            captureDesc: "El análisis de sus respuestas ha identificado su freno dominante. Ingrese su identidad para recibir su plan de acción personalizado:",
            lblFirstName: "Nombre de pila",
            lblLastName: "Apellido (opcional)",
            lblEmail: "Correo electrónico",
            lblPhone: "Teléfono / WhatsApp (opcional)",
            lblPhonePlaceholder: "Ej: +1 809 000 0000 o +34 600 000 000",
            btnUnlock: "Recibir mi plan de acción",
            privacyNote: "Sus datos son rigurosamente confidenciales. Prohibido el correo no deseado.",
            btnSubmitting: "Generando su plan de acción...",
            reportHeader: "Su Perfil Emprendedor",
            prescriptionHeader: "Plan de Acción Inmediato · Las Tres Prioridades",
            solutionsTag: "Los próximos pasos",
            solutionsTitle: "Salir del Estancamiento: Sus Vías de Acción.",
            solutionsDesc: "El diagnóstico está hecho. La toma de conciencia es estéril sin ejecución práctica. Dos opciones están disponibles según su grado de autonomía.",
            tier1Tag: "Fundamentos y mentalidad de campo",
            tier1Title: "Los Fundamentos del Emprendedor",
            tier1Desc: "Manual de campo denso y sin concesiones para erradicar ilusiones, superar el síndrome del impostor y cerrar sus primeros clientes sin capital inicial.",
            tier1Btn: "Obtener el Libro (5 €)",
            tier2Tag: "Ejecución metódica y herramientas",
            tier2Title: "Ebook Interactivo y Caja de Herramientas",
            tier2Desc: "Aplicación web completa con simulador financiero de rentabilidad, cuaderno de trabajo guardado y hoja de ruta sobre el terreno de 30 días.",
            tier2Btn: "Acceder a las Herramientas (27 €)",
            coachingTag: "Coaching · Dirección Estratégica",
            coachingTitle: "¿Necesita un copiloto para avanzar más rápido?",
            coachingDesc: "Las herramientas digitales proporcionan autonomía y método. Pero si su proyecto exige supervisión estratégica directa, modelado financiero a medida y acompañamiento en su territorio, nuestros programas de coaching toman el relevo.",
            coachingBtn: "Conocer el Acompañamiento",
            viewCatalog: "Consultar el catálogo completo de Domtom Connect →",
            whatsappGroupTag: "Comunidad Domtom Connect",
            whatsappGroupTitleIdea: "Unirse al grupo de portadores de proyectos",
            whatsappGroupDescIdea: "Rodéese de emprendedores que construyen desde cero. Comparta primeras victorias, encuentre socios serios y exíjanse mutuamente en un entorno de alto estándar.",
            whatsappGroupTitleActive: "Unirse a la red de empresas activas",
            whatsappGroupDescActive: "Acceda a la red de empresarios que ya facturan: oportunidades de negocio, experiencias reales compartidas y decisiones estratégicas tomadas entre pares que ejecutan.",
            whatsappGroupBtn: "Unirse al Grupo de WhatsApp"
        }
    };

    // Options du sélecteur de business (traduites avec regroupements sectoriels)
    const BUSINESS_OPTIONS = {
        fr: {
            types: [
                { group: "Pôles Entreprises, Métiers & B2B", value: "btp", label: "BTP, Gros Œuvre, Second Œuvre & Artisans du Bâtiment" },
                { group: "Pôles Entreprises, Métiers & B2B", value: "ingenierie", label: "Ingénierie, Bureaux d'Études & Conseil Technique" },
                { group: "Pôles Entreprises, Métiers & B2B", value: "juridique", label: "Cabinets Juridiques, Avocats, Notaires & Experts-Comptables" },
                { group: "Pôles Entreprises, Métiers & B2B", value: "tourisme", label: "Tourisme, Conciergeries, Gîtes, Lodges & Hébergements" },
                { group: "Pôles Entreprises, Métiers & B2B", value: "services_b2b", label: "Prestations de Services B2B, Conseil, IT & Recrutement" },
                { group: "Pôles Entreprises, Métiers & B2B", value: "service", label: "Prestation de service générale & Artisanat de proximité" },
                { group: "Pôles Marques, Terroirs, Commerce & Digital", value: "terroirs", label: "Agroalimentaire, Terroirs, Rhums, Boissons & Épicerie Fine" },
                { group: "Pôles Marques, Terroirs, Commerce & Digital", value: "cosmetique", label: "Cosmétique Naturelle, Soins Capillaires & Pharmacopée" },
                { group: "Pôles Marques, Terroirs, Commerce & Digital", value: "mode", label: "Mode, Textile, Accessoires & Créateurs Afro-Caribéens" },
                { group: "Pôles Marques, Terroirs, Commerce & Digital", value: "artisanat", label: "Artisanat d'Art, Senteurs, Bougies & Décoration" },
                { group: "Pôles Marques, Terroirs, Commerce & Digital", value: "ecommerce", label: "E-commerce, D2C & Vente en Ligne Multicanale" },
                { group: "Pôles Marques, Terroirs, Commerce & Digital", value: "physique", label: "Commerce Physique, Boutique & Restauration" },
                { group: "Pôles Marques, Terroirs, Commerce & Digital", value: "agro", label: "Production Agricole, Maraîchage & Transformation" }
            ],
            stages: [
                { value: "idee", label: "Porteur d'idée (projet non lancé, 0 € de chiffre d'affaires encaissé)" },
                { value: "lancement", label: "Lancement récent (< 1 an d'activité, ventes irrégulières, zéro salaire net)" },
                { value: "installe", label: "Entreprise installée (> 1 an d'activité, en quête de rentabilité nette ou de pivot)" }
            ]
        },
        en: {
            types: [
                { group: "Corporate, Trades & B2B Hubs", value: "btp", label: "Construction, Civil Engineering, Trades & Building Contractors" },
                { group: "Corporate, Trades & B2B Hubs", value: "ingenierie", label: "Engineering Consulting, Design Offices & Technical Advisory" },
                { group: "Corporate, Trades & B2B Hubs", value: "juridique", label: "Legal Firms, Attorneys, Notaries & Chartered Accountants" },
                { group: "Corporate, Trades & B2B Hubs", value: "tourisme", label: "Tourism, Concierge Services, Lodges, Villas & Hospitality" },
                { group: "Corporate, Trades & B2B Hubs", value: "services_b2b", label: "B2B Professional Services, IT, Corporate Consulting & Recruitment" },
                { group: "Corporate, Trades & B2B Hubs", value: "service", label: "General Professional Services & Local Trades" },
                { group: "Brands, Specialties, Retail & Digital Hubs", value: "terroirs", label: "Agri-Food, Local Specialties, Spirits, Rum & Fine Groceries" },
                { group: "Brands, Specialties, Retail & Digital Hubs", value: "cosmetique", label: "Natural Cosmetics, Hair Care & Tropical Pharmacopoeia" },
                { group: "Brands, Specialties, Retail & Digital Hubs", value: "mode", label: "Fashion, Apparel, Accessories & Afro-Caribbean Designers" },
                { group: "Brands, Specialties, Retail & Digital Hubs", value: "artisanat", label: "Fine Crafts, Home Decor, Scented Candles & Art" },
                { group: "Brands, Specialties, Retail & Digital Hubs", value: "ecommerce", label: "E-commerce, Direct-to-Consumer & Online Retail" },
                { group: "Brands, Specialties, Retail & Digital Hubs", value: "physique", label: "Brick-and-Mortar Retail, Local Shops & Food Service" },
                { group: "Brands, Specialties, Retail & Digital Hubs", value: "agro", label: "Agricultural Production, Farming & Processing" }
            ],
            stages: [
                { value: "idee", label: "Idea Stage (unlaunched venture, €0 / $0 in revenue collected)" },
                { value: "lancement", label: "Early Stage (< 1 year operational, erratic sales, zero net founder salary)" },
                { value: "installe", label: "Established Business (> 1 year operational, seeking net profitability or business model pivot)" }
            ]
        },
        es: {
            types: [
                { group: "Polos Empresariales, Oficios y B2B", value: "btp", label: "Construcción, Obra Civil, Reformas y Gremios del Edificio" },
                { group: "Polos Empresariales, Oficios y B2B", value: "ingenierie", label: "Ingeniería, Oficinas Técnicas y Consultoría Especializada" },
                { group: "Polos Empresariales, Oficios y B2B", value: "juridique", label: "Despachos Jurídicos, Abogados, Notarías y Asesorías Fiscales" },
                { group: "Polos Empresariales, Oficios y B2B", value: "tourisme", label: "Turismo, Conserjerías, Lodges, Hoteles y Alojamientos" },
                { group: "Polos Empresariales, Oficios y B2B", value: "services_b2b", label: "Servicios Profesionales B2B, Consultoría, TI y Selección" },
                { group: "Polos Empresariales, Oficios y B2B", value: "service", label: "Servicios Profesionales Generales y Artesanía Local" },
                { group: "Marcas, Productos Locales, Comercio y Digital", value: "terroirs", label: "Agroalimentación, Productos Típicos, Licores, Ron y Gourmet" },
                { group: "Marcas, Productos Locales, Comercio y Digital", value: "cosmetique", label: "Cosmética Natural, Cuidado Capilar y Farmacopea Tradicional" },
                { group: "Marcas, Productos Locales, Comercio y Digital", value: "mode", label: "Moda, Textil, Complementos y Creadores Afrocaribeños" },
                { group: "Marcas, Productos Locales, Comercio y Digital", value: "artisanat", label: "Artesanía de Autor, Decoración y Velas Perfumadas" },
                { group: "Marcas, Productos Locales, Comercio y Digital", value: "ecommerce", label: "Comercio Electrónico, Venta Online D2C y Marcas Digitales" },
                { group: "Marcas, Productos Locales, Comercio y Digital", value: "physique", label: "Comercio Físico de Proximidad, Tiendas y Restauración" },
                { group: "Marcas, Productos Locales, Comercio y Digital", value: "agro", label: "Producción Agrícola, Cultivos y Transformación" }
            ],
            stages: [
                { value: "idee", label: "Fase de Idea (proyecto no lanzado, 0 € / $0 en facturación real)" },
                { value: "lancement", label: "Lanzamiento Reciente (< 1 año de actividad, ventas irregulares, sin salario)" },
                { value: "installe", label: "Empresa Establecida (> 1 año de actividad, en busca de rentabilidad neta o pivote)" }
            ]
        }
    };

    // 10 Actes — structure par stade (idee / lancement / installe)
    // Chaque acte contient 3 jeux complets : question + options + mirrors
    const ACTS_DATABASE = {
        fr: [
            {
                id: 1,
                label: "Question 1 · La gestation et le temps suspendu",
                quote: "Une idée ne mûrit pas dans un carnet. Elle s'évente, perd de sa puissance et finit par vous anesthésier. L'attente n'est presque jamais de la prudence : c'est la peur panique de poser la première pierre sous les yeux de votre communauté.",
                stages: {
                    idee: {
                        question: (ctx) => `Depuis combien de temps l'idée de ${ctx.businessShortLabel} tourne-t-elle dans votre tête sans qu'un seul client n'ait encore payé ${ctx.prep} ?`,
                        options: [
                            { letter: "A", text: "Moins de trois mois. L'idée est fraîche, je prépare activement mon plan de lancement.", archetype: "theoricien", mirror: "L'élan est là. Mais sans confrontation commerciale dans les 15 prochains jours, cette idée rejoindra le cimetière des projets jamais lancés." },
                            { letter: "B", text: "Entre trois et douze mois. J'attends les bonnes conditions : le bon moment, le bon capital, la bonne opportunité.", archetype: "perfectionniste", mirror: "Le bon moment n'existera jamais. Chaque jour d'attente est un client offert gratuitement à votre concurrence." },
                            { letter: "C", text: "Entre un et trois ans. J'affine encore le concept pour être parfaitement prêt avant de me lancer.", archetype: "intimide", mirror: "Trois ans à affiner sans jamais tester. Vous ne préparez plus : vous procrastinez avec méthode." },
                            { letter: "D", text: "Plus de trois ans. Les circonstances économiques et le contexte local ne sont jamais vraiment favorables.", archetype: "mendiant", mirror: "Le contexte économique ne lance pas les entreprises. Les décisions courageuses, oui." }
                        ]
                    },
                    lancement: {
                        question: (ctx) => `Depuis combien de temps ${ctx.businessShortLabel} tourne-t-il sans vous verser un salaire net régulier ${ctx.prep} ?`,
                        options: [
                            { letter: "A", text: "Moins de trois mois. L'activité démarre, les premières ventes arrivent progressivement.", archetype: "theoricien", mirror: "C'est encore fragile. Concentrez toute votre énergie sur l'acquisition client directe, pas sur l'optimisation de votre site ou vos visuels." },
                            { letter: "B", text: "Entre trois et douze mois. Les ventes sont irrégulières, je n'arrive pas encore à me payer.", archetype: "perfectionniste", mirror: "Passé six mois sans salaire, c'est votre routine commerciale qui est défaillante, pas votre offre. Changez de méthode." },
                            { letter: "C", text: "Plus de douze mois. Je génère du chiffre d'affaires mais insuffisant pour me verser un salaire décent.", archetype: "intimide", mirror: "Un an sans salaire, c'est un an de bénévolat dans votre propre entreprise. Un pivot commercial s'impose maintenant." },
                            { letter: "D", text: "Depuis plusieurs années. Je maintiens l'activité à bout de bras sans jamais franchir le cap.", archetype: "mendiant", mirror: "Maintenir une activité qui ne vous nourrit pas depuis plusieurs années est la forme élaborée de l'auto-illusion. Pivot ou arrêt net." }
                        ]
                    },
                    installe: {
                        question: (ctx) => `Votre activité tourne depuis plus d'un an ${ctx.prep}. Depuis combien de temps stagne-t-elle sans atteindre la rentabilité nette que vous visez ?`,
                        options: [
                            { letter: "A", text: "La rentabilité nette est atteinte et en croissance. Je cherche maintenant à optimiser et structurer.", archetype: "terrain", mirror: "Vous avez validé le modèle. La partie se joue maintenant sur l'optimisation des marges et la structuration de votre croissance." },
                            { letter: "B", text: "Entre six et dix-huit mois de stagnation. Le CA tourne mais la marge nette reste insuffisante.", archetype: "perfectionniste", mirror: "Le CA est là mais la marge nette manque. C'est votre structure de coûts ou votre pricing qui défaille, pas votre marché." },
                            { letter: "C", text: "Plus de dix-huit mois. Je génère du CA mais sans jamais dégager de bénéfice net sur lequel m'appuyer.", archetype: "intimide", mirror: "Vous savez exactement ce qui bloque. L'indécision face à la restructuration coûte plus cher que l'erreur de l'action." },
                            { letter: "D", text: "Depuis le début. Je n'ai jamais vraiment été rentable. Je survis grâce à d'autres revenus ou à la famille.", archetype: "mendiant", mirror: "Une activité qui n'a jamais été rentable confirme que le modèle économique doit être refondu de fond en comble." }
                        ]
                    }
                }
            },
            {
                id: 2,
                label: "Question 2 · L'illusion du financement préalable",
                quote: "L'alibi classique consiste à affirmer : « Si seulement j'avais 20 000 euros, tout irait vite. » Mais l'argent n'a jamais apporté de clarté. L'argent amplifie ce qui existe déjà : si votre offre est floue sans argent, elle deviendra un gouffre financier avec du capital.",
                stages: {
                    idee: {
                        question: (ctx) => `Pour lancer ${ctx.businessShortLabel} sans capital externe ${ctx.prep}, quelle est votre stratégie de financement immédiate ?`,
                        options: [
                            { letter: "A", text: "J'attends une subvention publique, un prêt d'honneur ou un investisseur avant de démarrer quoi que ce soit.", archetype: "mendiant", mirror: "Attendre une aide publique pour prouver votre idée, c'est confier votre destin à des comités qui n'ont jamais tenu une caisse." },
                            { letter: "B", text: "Je prévois d'investir mes économies personnelles dans du stock ou du matériel avant d'avoir mes premières commandes.", archetype: "perfectionniste", mirror: "Immobiliser votre cash dans du matériel sans commande ferme est la première cause de mort prématurée d'un projet de démarrage." },
                            { letter: "C", text: "Je vends d'abord. L'acompte du premier client finance l'exécution et valide mon offre avant tout investissement.", archetype: "terrain", mirror: "C'est le principe du business de terrain : votre client valide votre pertinence avant que la banque ne se prononce." },
                            { letter: "D", text: "Je n'ai pas encore de prévisionnel précis. Je verrai avec les premières ventes comment financer la suite.", archetype: "theoricien", mirror: "Naviguer sans prévisionnel, c'est foncer vers un mur en toute bonne foi. Les charges n'attendent pas vos premières ventes." }
                        ]
                    },
                    lancement: {
                        question: (ctx) => `Votre activité a démarré ${ctx.prep}. Quelle est votre stratégie concrète pour sortir de la zone de survie financière ?`,
                        options: [
                            { letter: "A", text: "J'attends une subvention ou un prêt bancaire pour financer le développement et passer un cap.", archetype: "mendiant", mirror: "Une aide publique ne résoudra pas un problème commercial. Si l'offre ne trouve pas ses clients, aucun crédit ne sauvera la mise." },
                            { letter: "B", text: "Je réinvestis toutes les recettes dans du stock ou du matériel supplémentaire pour monter en puissance.", archetype: "perfectionniste", mirror: "Réinvestir avant d'avoir prouvé la récurrence commerciale, c'est creuser un gouffre à la vitesse de vos ventes." },
                            { letter: "C", text: "J'optimise mes prix, je facture des acomptes et je coupe toute charge qui ne génère pas de CA sous 30 jours.", archetype: "terrain", mirror: "La seule sortie de survie : plus de marge sur chaque transaction et zéro livraison sans acompte confirmé." },
                            { letter: "D", text: "Je n'ai pas de suivi précis de ma trésorerie. Je navigue au feeling et je paie les urgences au fur et à mesure.", archetype: "theoricien", mirror: "Piloter sans tableau de bord, c'est conduire de nuit sans phares. Vos charges sont précises même quand vos revenus ne le sont pas." }
                        ]
                    },
                    installe: {
                        question: (ctx) => `${ctx.prep}, votre activité tourne depuis plus d'un an. Quelle est votre approche concrète pour atteindre la rentabilité nette ?`,
                        options: [
                            { letter: "A", text: "J'attends un investisseur ou un programme d'aide pour financer la croissance et passer au niveau supérieur.", archetype: "mendiant", mirror: "Un investisseur exige une traction prouvée. Sans marge nette démontrée, vous n'attirerez que des prédateurs." },
                            { letter: "B", text: "Je réinvestis systématiquement le CA dans le développement sans jamais me verser un salaire décent.", archetype: "perfectionniste", mirror: "Travailler gratuitement dans votre propre entreprise depuis plus d'un an n'est pas de la rigueur : c'est de la complaisance envers un modèle défaillant." },
                            { letter: "C", text: "Je revois ma structure tarifaire et mes charges fixes pour dégager une marge nette réelle dès ce trimestre.", archetype: "terrain", mirror: "La rentabilité ne vient pas avec le temps : elle vient d'une décision chirurgicale sur les prix et les coûts." },
                            { letter: "D", text: "Je n'ai pas de prévisionnel actualisé. La comptabilité est déléguée et je ne suis pas mes chiffres mensuellement.", archetype: "theoricien", mirror: "Déléguer sans comprendre votre propre P&L vous rend aveugle aux fuites de trésorerie les plus évidentes." }
                        ]
                    }
                }
            },
            {
                id: 3,
                label: "Question 3 · L'anatomie de l'offre et la marge brute",
                quote: "Une entreprise qui ne dégage pas 50 % à 70 % de marge brute sur ses prestations est une entreprise mourante. Casser ses prix pour plaire à tout le monde est la signature des amateurs apeurés.",
                stages: {
                    idee: {
                        question: (ctx) => `Comment avez-vous structuré votre future offre de ${ctx.businessShortLabel} pour qu'elle soit rentable dès le premier client ?`,
                        options: [
                            { letter: "A", text: "Je m'alignerai sur les prix les plus bas pour attirer un maximum de clients dès le départ.", archetype: "mendiant", mirror: "Démarrer par le bas du marché attire les clients les plus ingrats. Vous vous condamnez à travailler pour survivre plutôt que pour prospérer." },
                            { letter: "B", text: "Mon offre est exhaustive et complète mais j'ai du mal à l'expliquer clairement en moins de 30 secondes.", archetype: "theoricien", mirror: "Si vous ne savez pas expliquer ce que vous résolvez en 30 secondes, votre prospect ne comprendra pas pourquoi payer." },
                            { letter: "C", text: "J'ai une offre claire, un tarif ferme et une marge brute d'au moins 50% par prestation dès le départ.", archetype: "terrain", mirror: "C'est le bon départ : une offre compréhensible, un prix assumé, une marge qui tient la distance sans baisser la tête." },
                            { letter: "D", text: "Je n'ai pas encore fixé de tarif. J'attendrai mes premiers contacts pour voir ce que les gens sont prêts à payer.", archetype: "intimide", mirror: "Laisser le client fixer le prix sans ancrage préalable, c'est s'exposer systématiquement à la pression vers le bas dès la première négociation." }
                        ]
                    },
                    lancement: {
                        question: (ctx) => `Quelle est la structure tarifaire de ${ctx.businessShortLabel} depuis le lancement ${ctx.prep} ?`,
                        options: [
                            { letter: "A", text: "Je m'aligne sur les prix les plus bas du marché local pour capter des clients coûte que coûte.", archetype: "mendiant", mirror: "La guerre des prix attire les clients les plus toxiques. Vous vous épuisez 60 heures par semaine pour des marges qui ne couvrent pas vos charges." },
                            { letter: "B", text: "Mon offre est complète mais difficile à résumer : les prospects demandent souvent des précisions avant de décider.", archetype: "theoricien", mirror: "La confusion tue la vente. Si votre proposition exige une explication longue, c'est qu'elle n'est pas encore prête pour le marché." },
                            { letter: "C", text: "J'ai une offre packagée à forte valeur perçue avec un tarif ferme non négociable.", archetype: "terrain", mirror: "La seule voie pérenne : des clients sérieux qui jugent sur le résultat et respectent votre expertise parce que vous la respectez d'abord vous-même." },
                            { letter: "D", text: "Je facture à l'heure ou à la journée selon les demandes, sans forfait clair ni prix affiché.", archetype: "intimide", mirror: "Vendre ses heures plafonne vos revenus de façon absolue. Dès que vous tombez malade ou partez en vacances, votre CA s'arrête net." }
                        ]
                    },
                    installe: {
                        question: (ctx) => `Après plus d'un an d'activité ${ctx.prep}, comment pilotez-vous la marge brute de ${ctx.businessShortLabel} ?`,
                        options: [
                            { letter: "A", text: "Je baisse régulièrement mes prix pour fidéliser les clients existants et éviter de les perdre au profit de concurrents.", archetype: "mendiant", mirror: "Brader ses prix pour retenir un client prouve que votre valeur perçue est insuffisante. C'est votre positionnement qui fidélise, pas votre tarif." },
                            { letter: "B", text: "J'ai créé plusieurs gammes de prix mais je ne sais pas laquelle défendre ni sur quoi concentrer mes efforts.", archetype: "theoricien", mirror: "Une gamme floue dilue l'autorité commerciale. Un expert défend une offre principale, claire et assumée." },
                            { letter: "C", text: "J'ai revu mon pricing à la hausse, supprimé les prestations peu rentables et concentré l'énergie sur les marges élevées.", archetype: "terrain", mirror: "C'est la maturité du dirigeant : choisir ses clients plutôt que courir après tous les clients sans distinction." },
                            { letter: "D", text: "Je n'ai pas revu mes tarifs depuis plus d'un an par peur de perdre mes clients actuels si j'augmente.", archetype: "intimide", mirror: "L'inflation grignote votre marge sans toucher à vos prix. Chaque mois sans révision tarifaire vous appauvrit silencieusement." }
                        ]
                    }
                }
            },
            {
                id: 4,
                label: "Question 4 · Le gouffre des charges fixes et des dépenses futiles",
                quote: "Observez où part le compte en banque d'une jeune entreprise : logiciels inutiles, loyers surdimensionnés, baux commerciaux trop lourds. On dépense pour avoir l'air d'un patron avant d'avoir dégagé le premier bénéfice.",
                stages: {
                    idee: {
                        question: (ctx) => `Avant même de lancer ${ctx.businessShortLabel} ${ctx.prep}, comment planifiez-vous vos charges de démarrage ?`,
                        options: [
                            { letter: "A", text: "Je prévois de louer un local commercial ou un bureau dès le lancement pour avoir une image professionnelle.", archetype: "perfectionniste", mirror: "Un local avant les premiers clients, c'est une corde au cou avant d'avoir prouvé votre modèle. Le marché n'achète pas votre décor." },
                            { letter: "B", text: "Je démarre depuis chez moi ou en espace partagé avec des charges proches de zéro jusqu'à la première récurrence.", archetype: "terrain", mirror: "C'est la discipline du commando : aucun frais qui ne génère pas de CA dans les 30 prochains jours." },
                            { letter: "C", text: "Je n'ai pas encore estimé mes charges de fonctionnement. Je verrai au fur et à mesure selon les besoins réels.", archetype: "theoricien", mirror: "Ne pas connaître son point mort avant de lancer, c'est naviguer sans savoir quand vous coulerez." },
                            { letter: "D", text: "Je retarde le lancement parce que je n'ai pas encore le budget pour acheter tous les outils et équipements nécessaires.", archetype: "mendiant", mirror: "Les outils parfaits sont un alibi classique. Vos 3 premiers clients doivent être servis avec les moyens du bord." }
                        ]
                    },
                    lancement: {
                        question: (ctx) => `Comment gérez-vous vos coûts de fonctionnement depuis le lancement ${ctx.prep} ?`,
                        options: [
                            { letter: "A", text: "J'ai engagé des frais fixes lourds (bail, abonnements multiples, matériel) avant d'avoir une clientèle stable.", archetype: "perfectionniste", mirror: "Vous vous êtes mis la corde au cou avant le premier coup de vent. Opérez en mode commando léger jusqu'à ce que la trésorerie déborde." },
                            { letter: "B", text: "Je fonctionne avec des charges proches de zéro : chaque euro dépensé doit rapporter du CA sous 30 jours.", archetype: "terrain", mirror: "C'est la discipline des vainqueurs : aucun apparat, aucune vanité, seulement des dépenses directement productives." },
                            { letter: "C", text: "Je dépense au coup par coup sans calculer mon coût d'acquisition ni ma marge par prestation réelle.", archetype: "theoricien", mirror: "Ne pas connaître son coût d'acquisition revient à jeter des billets dans un brasier en espérant qu'il en ressorte de l'or." },
                            { letter: "D", text: "Je retarde certains investissements parce que je manque de budget pour les outils que je voudrais avoir.", archetype: "mendiant", mirror: "Les outils parfaits sont un alibi. Vos premiers clients doivent être servis avec ce dont vous disposez maintenant." }
                        ]
                    },
                    installe: {
                        question: (ctx) => `Depuis plus d'un an ${ctx.prep}, comment contrôlez-vous vos charges fixes pour dégager une marge nette positive ?`,
                        options: [
                            { letter: "A", text: "J'ai accumulé des charges fixes qui pèsent sur ma rentabilité sans vraiment réussir à les réduire.", archetype: "perfectionniste", mirror: "Des charges fixes non maîtrisées sont un cancer lent. Chaque euro injustifié réduit silencieusement votre liberté de manœuvre." },
                            { letter: "B", text: "J'ai rationalisé mes coûts, renégocié mes contrats et supprimé toutes les dépenses sans retour mesurable.", archetype: "terrain", mirror: "La rigueur des opérateurs rentables : zéro dépense qui ne génère pas de marge directe ou indirecte vérifiable." },
                            { letter: "C", text: "J'ai du mal à maîtriser mes charges car mon activité varie fortement d'un mois à l'autre.", archetype: "theoricien", mirror: "La variabilité du CA ne justifie pas des charges fixes non pilotées. Un tableau de bord mensuel résout ce problème structurellement." },
                            { letter: "D", text: "Je garde des charges importantes par peur de perdre en qualité ou en crédibilité si je comprime les coûts.", archetype: "intimide", mirror: "La qualité n'est pas proportionnelle aux charges. Les opérateurs rentables font mieux avec moins." }
                        ]
                    }
                }
            },
            {
                id: 5,
                label: "Question 5 · L'anémie commerciale et la prospection fantôme",
                quote: "La prospection active est la seule pratique qui garantit la survie. Attendre passivement que les clients arrivent est le luxe des monopoles. Dans nos marchés, personne ne vient frapper à votre porte sans y être invité.",
                stages: {
                    idee: {
                        question: (ctx) => `Quelle est votre stratégie concrète pour décrocher vos 3 premiers clients payants ${ctx.prep} avant tout autre investissement ?`,
                        options: [
                            { letter: "A", text: "Je compte sur le bouche-à-oreille de mon réseau personnel pour que les premiers clients viennent naturellement.", archetype: "intimide", mirror: "Le bouche-à-oreille passif de votre entourage ne vous apportera que des clients fragiles. Les vrais clients, vous devez aller les chercher." },
                            { letter: "B", text: "Je construis d'abord mon site web, mes réseaux sociaux et mes supports visuels avant de prospecter.", archetype: "theoricien", mirror: "Attendre d'avoir un site parfait pour prospecter est l'alibi classique. Vos 3 premiers clients n'ont pas besoin de votre site, ils ont besoin de votre proposition." },
                            { letter: "C", text: "Je contacte directement 10 prospects qualifiés par semaine par téléphone ou en face à face dès maintenant.", archetype: "terrain", mirror: "C'est la seule méthode qui garantit des résultats avant que votre énergie soit épuisée. Le contact direct est irremplaçable." },
                            { letter: "D", text: "J'attends d'avoir tout finalisé avant de prospecter pour ne pas risquer de gâcher ma première impression.", archetype: "perfectionniste", mirror: "Votre réputation se construit avec des clients, pas avec des préparatifs. Prospectez maintenant avec ce que vous avez." }
                        ]
                    },
                    lancement: {
                        question: (ctx) => `Quelle est votre routine hebdomadaire réelle d'acquisition client ${ctx.prep} depuis que vous avez lancé ?`,
                        options: [
                            { letter: "A", text: "Je compte sur le bouche-à-oreille naturel et j'attends qu'on me contacte spontanément.", archetype: "intimide", mirror: "Le bouche-à-oreille passif est la méthode de l'espoir. Une entreprise ne peut pas survivre en attendant que le hasard envoie des clients." },
                            { letter: "B", text: "Je publie régulièrement sur les réseaux sociaux en espérant générer des messages entrants.", archetype: "theoricien", mirror: "Les likes ne paient pas les factures. Publier sans processus de conversion directe est une diversion élégante pour éviter de vendre." },
                            { letter: "C", text: "Je contacte directement au moins 10 prospects qualifiés par semaine par téléphone ou sur le terrain.", archetype: "terrain", mirror: "C'est le seul moteur qui garantit la survie. Ceux qui décrochent leur téléphone et vont au contact direct dominent leur marché local." },
                            { letter: "D", text: "Je suis mal à l'aise avec la vente et j'attends de trouver quelqu'un qui s'en chargera à ma place.", archetype: "mendiant", mirror: "Si le fondateur ne sait pas vendre son propre service, personne ne le fera à sa place avec la même conviction." }
                        ]
                    },
                    installe: {
                        question: (ctx) => `Après plus d'un an, comment avez-vous industrialisé l'acquisition client de ${ctx.businessShortLabel} ${ctx.prep} ?`,
                        options: [
                            { letter: "A", text: "Je dépends encore principalement du bouche-à-oreille et des recommandations sans système de prospection actif.", archetype: "intimide", mirror: "Le bouche-à-oreille plafonne toujours. Sans système de prospection actif, votre croissance est captive du hasard et de la saisonnalité." },
                            { letter: "B", text: "Je mise tout sur le contenu et les réseaux sociaux pour attirer des prospects de manière organique.", archetype: "theoricien", mirror: "Le contenu organique seul est trop aléatoire pour alimenter une entreprise établie. Un pipeline commercial structuré est indispensable." },
                            { letter: "C", text: "J'ai un système de prospection régulière et mesurable avec des objectifs hebdomadaires précis et suivis.", archetype: "terrain", mirror: "C'est la marque des entreprises qui durent : la prospection est une discipline permanente, pas une activité de crise." },
                            { letter: "D", text: "Je cherche à déléguer l'acquisition client mais je n'ai pas encore les moyens de recruter quelqu'un pour s'en charger.", archetype: "mendiant", mirror: "Sans maîtriser vous-même les bases de l'acquisition, vous ne saurez pas manager un commercial. Apprenez d'abord à vendre." }
                        ]
                    }
                }
            },
            {
                id: 6,
                label: "Question 6 · La négociation avortée et le recouvrement fantôme",
                quote: "L'argent de votre client ne vous appartient qu'au moment où il entre sur votre compte. Facturer sans encaisser est du travail bénévole. Le bon payeur ne se plaint jamais des acomptes : il sait que les artisans sérieux en exigent.",
                stages: {
                    idee: {
                        question: (ctx) => `Avant même de démarrer ${ctx.businessShortLabel} ${ctx.prep}, quelle règle fixez-vous sur les acomptes et la facturation ?`,
                        options: [
                            { letter: "A", text: "Je facturerai après la livraison complète pour installer la confiance avec mes premiers clients.", archetype: "theoricien", mirror: "Livrer avant de recevoir un centime, c'est financer gratuitement vos clients. Cela commence dès le premier contrat." },
                            { letter: "B", text: "J'exigerai 50% d'acompte à la commande et solde à la livraison, sans exception ni négociation.", archetype: "terrain", mirror: "La règle d'or du démarrage : l'acompte filtre les mauvais payeurs avant qu'ils n'entrent dans votre pipeline." },
                            { letter: "C", text: "Je serai souple sur les conditions de paiement au départ pour ne pas décourager mes premiers prospects.", archetype: "mendiant", mirror: "La souplesse financière avec des inconnus est une erreur classique. Vos conditions commerciales définissent le calibre de vos clients." },
                            { letter: "D", text: "Je n'ai pas encore réfléchi à ma politique de facturation. J'adapterai selon les demandes au cas par cas.", archetype: "intimide", mirror: "Sans règle de facturation avant le premier client, vous affronterez votre premier litige commercial sans aucune armure." }
                        ]
                    },
                    lancement: {
                        question: (ctx) => `Depuis le lancement ${ctx.prep}, comment gérez-vous les négociations de prix et les retards de paiement ?`,
                        options: [
                            { letter: "A", text: "J'accorde spontanément des réductions pour ne pas perdre la vente, quitte à travailler à marge nulle ou négative.", archetype: "mendiant", mirror: "Le client qui négocie au rabais est celui qui vous causera le plus de litiges. Vous signez votre appauvrissement systématique." },
                            { letter: "B", text: "J'exige 50% d'acompte à la commande et bloque toute livraison en cas de retard de règlement.", archetype: "terrain", mirror: "Règle de fer indispensable : l'acompte filtre les mauvais payeurs dès l'entrée et sécurise votre trésorerie à chaque transaction." },
                            { letter: "C", text: "J'attends poliment les paiements par pudeur et n'ose pas relancer fermement par peur de vexer le client.", archetype: "intimide", mirror: "La fausse pudeur financière enrichit les mauvais payeurs et appauvrit systématiquement les gens honnêtes et patients." },
                            { letter: "D", text: "Je livre l'intégralité du travail avant facturation en faisant confiance à la parole donnée.", archetype: "theoricien", mirror: "Livrer sans acompte sur nos marchés est une imprudence grave : votre rapport de force chute à zéro une fois le travail livré." }
                        ]
                    },
                    installe: {
                        question: (ctx) => `Après plus d'un an d'activité ${ctx.prep}, comment structurez-vous vos conditions de paiement et votre recouvrement ?`,
                        options: [
                            { letter: "A", text: "Je n'ai toujours pas de règle ferme d'acompte et j'adapte au cas par cas selon chaque client et chaque situation.", archetype: "mendiant", mirror: "Sans règle de paiement uniforme, chaque client définit les termes de votre relation financière à votre détriment." },
                            { letter: "B", text: "J'ai des conditions écrites claires : 50% à la commande, solde avant livraison, pénalités de retard appliquées sans dérogation.", archetype: "terrain", mirror: "C'est le niveau de maturité d'une entreprise installée : des conditions connues, respectées et défendues sans exception." },
                            { letter: "C", text: "J'ai des conditions en théorie mais je les assouplis régulièrement pour de bons clients ou des situations délicates.", archetype: "intimide", mirror: "Toute exception crée un précédent. Vos meilleurs clients respectent vos règles : les autres cherchent ceux qui cèdent." },
                            { letter: "D", text: "J'ai délégué la facturation et le recouvrement mais je n'ai pas de visibilité précise sur mes encours impayés.", archetype: "theoricien", mirror: "Déléguer sans surveiller, c'est découvrir les impayés quand il est trop tard pour les récupérer sans frais." }
                        ]
                    }
                }
            },
            {
                id: 7,
                label: "Question 7 · La pression territoriale et le regard des proches",
                quote: "Dans nos communautés, le qu'en-dira-t-on est un poison violent. Tout le monde observe, commente et attend parfois le premier faux pas pour rappeler que l'ambition dérange.",
                stages: {
                    idee: {
                        question: (ctx) => `Quelle est la principale pression de votre entourage qui retarde votre décision de lancer ${ctx.prep} ?`,
                        options: [
                            { letter: "A", text: "La peur que mes proches ou ma communauté me jugent sévèrement si le projet ne réussit pas comme prévu.", archetype: "intimide", mirror: "Ceux qui n'ont jamais pris de risque n'ont pas droit de cité sur vos décisions. Leur opinion n'a aucun poids commercial." },
                            { letter: "B", text: "Les sollicitations financières constantes de l'entourage qui attendent que je réussisse pour venir me demander.", archetype: "mendiant", mirror: "On ne distribue pas l'eau d'un puits qui n'est pas encore creusé. Votre projet passe avant toute redistribution prématurée." },
                            { letter: "C", text: "Le sentiment d'être isolé sans modèle ni mentor qui ait vraiment réussi dans mon contexte territorial.", archetype: "theoricien", mirror: "L'absence de modèle local est un inconfort, pas une impossibilité. Les pionniers n'ont par définition jamais eu de mentor précédent." },
                            { letter: "D", text: "Aucune. J'ai clairement séparé ma vie personnelle de mon projet et je ne rends de comptes qu'à moi-même.", archetype: "terrain", mirror: "Cette clarté est le premier fondement d'une décision de lancement saine. Protégez ce périmètre décisionnel à tout prix." }
                        ]
                    },
                    lancement: {
                        question: (ctx) => `Depuis que vous avez lancé ${ctx.prep}, quelle interférence sociale pèse encore sur vos décisions ?`,
                        options: [
                            { letter: "A", text: "La peur des commérages et du jugement de mes proches si mon projet trébuche ou échoue publiquement.", archetype: "intimide", mirror: "Ceux qui critiquent votre initiative le font pour se rassurer sur leur propre lâcheté. Leurs commentaires ne paient pas vos charges." },
                            { letter: "B", text: "Les sollicitations financières de famille et amis qui s'alourdissent à mesure que l'activité progresse.", archetype: "mendiant", mirror: "On ne distribue pas l'eau d'un puits qui n'est pas encore creusé. Consolidez votre activité avant de prétendre redistribuer." },
                            { letter: "C", text: "Le sentiment d'être incompris et seul, sans pairs de haut niveau avec qui échanger franchement sur les enjeux.", archetype: "theoricien", mirror: "La solitude du dirigeant est réelle, mais elle ne doit jamais servir d'alibi pour l'immobilisme décisionnel." },
                            { letter: "D", text: "Aucune : j'ai tracé une frontière étanche entre mes affaires professionnelles et ma vie personnelle.", archetype: "terrain", mirror: "Cette lucidité est indispensable. Les affaires exigent la rigueur du chirurgien : froid sur les chiffres, neutre sur les opinions." }
                        ]
                    },
                    installe: {
                        question: (ctx) => `Même après plus d'un an d'activité ${ctx.prep}, quelle pression territoriale freine encore votre développement ?`,
                        options: [
                            { letter: "A", text: "La jalousie de concurrents locaux ou d'anciens proches qui sabotent discrètement ma réputation à mesure que je progresse.", archetype: "intimide", mirror: "La jalousie des autres prouve que vous avancez. Elle ne disparaît pas avec le temps : vous devez apprendre à l'ignorer avec méthode." },
                            { letter: "B", text: "Les obligations familiales et communautaires qui s'alourdissent à mesure que l'activité progresse et que la visibilité augmente.", archetype: "mendiant", mirror: "La croissance attire les demandes. Sans frontières claires et défendues, chaque progrès génère une nouvelle sollicitation." },
                            { letter: "C", text: "La difficulté de trouver des pairs sérieux avec qui partager les enjeux stratégiques d'une entreprise établie sur le terrain.", archetype: "theoricien", mirror: "Les réseaux d'entrepreneurs établis existent. Cherchez-les activement plutôt qu'attendre qu'ils viennent spontanément à vous." },
                            { letter: "D", text: "Aucune. Ma vie professionnelle et personnelle sont strictement séparées depuis le premier jour de l'activité.", archetype: "terrain", mirror: "Cette discipline est le socle de la durée. Les entreprises qui durent ont des dirigeants qui protègent leur espace décisionnel." }
                        ]
                    }
                }
            },
            {
                id: 8,
                label: "Question 8 · La gestion du temps et l'alibi de l'occupation",
                quote: "Les entrepreneurs qui échouent ne manquent pas de temps. Ils manquent de priorités. L'occupation permanente est la forme la plus sophistiquée de la procrastination : on est absorbé par des tâches secondaires pendant que les actes décisifs attendent.",
                stages: {
                    idee: {
                        question: (ctx) => `Comment occupez-vous réellement vos journées depuis que l'idée de ${ctx.businessShortLabel} s'est imposée ${ctx.prep} ?`,
                        options: [
                            { letter: "A", text: "Je travaille essentiellement sur mon branding, mon logo, mes supports et mes visuels avant tout contact commercial.", archetype: "perfectionniste", mirror: "Vous bâtissez le décor avant d'avoir le texte de la pièce. Arrêtez de décorer et allez trouver un client cette semaine." },
                            { letter: "B", text: "Je consomme des vidéos de motivation, des podcasts business et des formations sans passer à l'action concrète.", archetype: "theoricien", mirror: "L'infobésité est une drogue douce. Elle vous donne l'illusion de progresser pendant que vous faites du surplace." },
                            { letter: "C", text: "Je consacre chaque jour du temps à contacter des prospects ou à tester mon offre auprès d'acheteurs potentiels.", archetype: "terrain", mirror: "C'est la seule bonne nouvelle de ce diagnostic : vous êtes déjà en contact avec le terrain. Maintenez cette cadence." },
                            { letter: "D", text: "Mes journées sont entièrement occupées par mon emploi salarié et mes obligations familiales. Aucun créneau dédié au projet.", archetype: "intimide", mirror: "Sans créneaux sanctuarisés chaque matin pour votre projet, il restera un projet. Deux heures par jour suffisent pour changer de trajectoire." }
                        ]
                    },
                    lancement: {
                        question: (ctx) => `Où est passée la majeure partie de vos heures productives ces deux dernières semaines ${ctx.prep} ?`,
                        options: [
                            { letter: "A", text: "À peaufiner mon logo, mes visuels, mon feed ou mes documents internes sans contacter un seul client.", archetype: "perfectionniste", mirror: "C'est de l'artisanat cosmétique. Vous repeignez un magasin où aucun client n'est encore entré." },
                            { letter: "B", text: "À consommer des vidéos de motivation, des podcasts ou des formations sans les appliquer concrètement.", archetype: "theoricien", mirror: "L'infobésité est une drogue douce : elle vous donne l'illusion de progresser alors que vous êtes assis sur vos mains." },
                            { letter: "C", text: "À négocier avec des clients, livrer des prestations et relancer des devis sur le terrain ou par téléphone.", archetype: "terrain", mirror: "Vous faites ce que 90% des entrepreneurs refusent de faire. Maintenez impérativement cette cadence commerciale." },
                            { letter: "D", text: "À gérer des urgences annexes, la fatigue du salariat parallèle ou les obligations familiales urgentes.", archetype: "intimide", mirror: "Si vous ne sanctuarisez pas deux heures chaque matin pour votre liberté économique, les urgences mangeront votre vie entière." }
                        ]
                    },
                    installe: {
                        question: (ctx) => `Après plus d'un an, comment arbitrez-vous votre temps entre l'opérationnel quotidien et le développement stratégique ${ctx.prep} ?`,
                        options: [
                            { letter: "A", text: "Je suis entièrement absorbé par l'opérationnel. Aucun temps disponible pour piloter stratégiquement ou prendre du recul.", archetype: "perfectionniste", mirror: "Un dirigeant prisonnier de l'opérationnel ne dirige plus : il exécute. Votre rôle est de sortir la tête du guidon." },
                            { letter: "B", text: "Je consacre régulièrement du temps à la réflexion stratégique, au pilotage des indicateurs et au développement commercial.", archetype: "terrain", mirror: "C'est la transition entre l'entrepreneur qui fait et le dirigeant qui pilote. Vous êtes sur la bonne trajectoire." },
                            { letter: "C", text: "Je ne mesure pas réellement comment je répartis mon temps. Je réagis aux urgences du moment sans agenda structuré.", archetype: "theoricien", mirror: "Sans pilotage du temps, votre emploi du jour est écrit par vos urgences, pas par votre stratégie de croissance." },
                            { letter: "D", text: "Je suis épuisé par l'activité quotidienne et je n'ai plus d'énergie pour penser à long terme ou innover.", archetype: "intimide", mirror: "L'épuisement opérationnel chronique est le signal que vous devez déléguer ou restructurer votre offre de fond en comble." }
                        ]
                    }
                }
            },
            {
                id: 9,
                label: "Question 9 · Le piège de l'association et la gouvernance",
                quote: "S'associer par amitié ou par parenté sans contrat écrit est le moyen le plus rapide de perdre à la fois son argent, son projet et ses amis. Une association est un contrat d'intérêts et de compétences complémentaires.",
                stages: {
                    idee: {
                        question: (ctx) => `Comment envisagez-vous de structurer la direction de votre futur ${ctx.businessShortLabel} ${ctx.prep} ?`,
                        options: [
                            { letter: "A", text: "Je prévois de m'associer avec un ami ou un proche de confiance pour partager les risques et les décisions.", archetype: "intimide", mirror: "L'association amicale sans pacte écrit est la bombe à retardement du démarrage. Quand l'argent arrive, la confiance disparaît." },
                            { letter: "B", text: "Je prendrai seul les commandes et ferai appel à des prestataires payés au livrable selon les besoins.", archetype: "terrain", mirror: "La configuration la plus saine pour démarrer : l'unicité de commandement évite les débats stériles et garantit la réactivité maximale." },
                            { letter: "C", text: "Je cherche activement un associé pour compenser mes lacunes en technique, en vente ou en gestion administrative.", archetype: "mendiant", mirror: "Si vous ne maîtrisez pas les fondamentaux de votre modèle, un associé plus aguerri prendra naturellement et légitimement le contrôle." },
                            { letter: "D", text: "J'hésite à parler de mon idée par peur qu'on me la copie avant que je ne la lance et que je ne la protège.", archetype: "perfectionniste", mirror: "Une idée non exécutée ne vaut rien sur un marché. Personne ne vole des idées : les compétiteurs copient uniquement les boîtes qui font du profit." }
                        ]
                    },
                    lancement: {
                        question: (ctx) => `Comment est structurée la gouvernance de ${ctx.businessShortLabel} depuis le lancement ${ctx.prep} ?`,
                        options: [
                            { letter: "A", text: "Je me suis associé avec un proche sur la confiance verbale, sans pacte d'associés formel ni règles écrites.", archetype: "intimide", mirror: "C'est une bombe à retardement. Dès que le premier gros bénéfice ou la première dette fiscale apparaîtra, le conflit détruira la boîte." },
                            { letter: "B", text: "J'assume seul le commandement en m'appuyant sur des prestataires payés sur livrable précis.", archetype: "terrain", mirror: "La configuration la plus saine pour démarrer : l'unicité de commandement évite les débats stériles et garantit une réactivité maximale." },
                            { letter: "C", text: "Je cherche un associé sauveur pour combler mes lacunes et partager le risque financier avec moi.", archetype: "mendiant", mirror: "Personne ne viendra vous sauver. Si vous ne maîtrisez pas les bases de votre modèle, un associé aguerri prendra le contrôle." },
                            { letter: "D", text: "J'ai peur de déléguer ou de partager mes plans de crainte qu'on copie mon concept ou me précède sur le marché.", archetype: "perfectionniste", mirror: "Une idée non exécutée a une valeur marchande nulle. Personne ne vole une idée : les gens copient les boîtes qui font du profit." }
                        ]
                    },
                    installe: {
                        question: (ctx) => `Comment est organisée la prise de décision dans ${ctx.businessShortLabel} après plus d'un an d'activité ${ctx.prep} ?`,
                        options: [
                            { letter: "A", text: "Je suis seul décideur, épuisé, et incapable de tout gérer. Je cherche un associé pour partager la charge.", archetype: "intimide", mirror: "L'association par épuisement est la pire raison de s'associer. Cherchez d'abord à déléguer des tâches, pas la direction." },
                            { letter: "B", text: "J'ai structuré des rôles clairs, des indicateurs partagés et des prestataires responsabilisés sur des livrables précis.", archetype: "terrain", mirror: "C'est la maturité organisationnelle d'une entreprise installée : chaque euro de délégation doit générer du CA ou de la marge." },
                            { letter: "C", text: "Je me suis associé mais la gouvernance est floue et les désaccords ralentissent toutes les décisions importantes.", archetype: "mendiant", mirror: "Une gouvernance floue avec un associé est plus paralysante que d'être seul. Réglez les règles du jeu maintenant ou séparation." },
                            { letter: "D", text: "Je délègue beaucoup mais je n'ai pas de visibilité claire sur ce que font réellement mes prestataires ou collaborateurs.", archetype: "perfectionniste", mirror: "Déléguer sans indicateurs de suivi, c'est financer l'improvisation des autres avec votre propre argent." }
                        ]
                    }
                }
            },
            {
                id: 10,
                label: "Question 10 · La sentence du temps et l'urgence de rupture",
                quote: "Les années ne pardonnent rien. Pendant que l'on se répète qu'on lancera la machine après les prochaines vacances ou quand la situation sera plus stable, les mois s'envolent et l'énergie s'épuise.",
                stages: {
                    idee: {
                        question: (ctx) => `Si dans douze mois votre projet de ${ctx.businessShortLabel} n'est toujours pas lancé ${ctx.prep}, quel sera votre constat honnête ?`,
                        options: [
                            { letter: "A", text: "Une fureur implacable contre moi-même d'avoir laissé encore une année entière s'évaporer sans acte commercial concret.", archetype: "perfectionniste", mirror: "Cette fureur doit devenir votre carburant immédiat. Transformez-la en première action commerciale concrète cette semaine, pas le mois prochain." },
                            { letter: "B", text: "Une résignation progressive. Je finirai par accepter que l'entrepreneuriat n'est pas fait pour moi.", archetype: "intimide", mirror: "C'est la fin la plus tragique : la capitulation avant même le combat. Votre projet mérite au moins l'épreuve du marché réel." },
                            { letter: "C", text: "L'angoisse grandissante d'arriver à la fin de ma vie active sans avoir tenté de construire quelque chose de solide.", archetype: "mendiant", mirror: "Vos proches n'ont pas besoin de vos projets futurs. Ils ont besoin de vous voir poser des actes concrets dès aujourd'hui." },
                            { letter: "D", text: "Impossible. La rupture commence cette semaine. Je présente mon offre à 5 personnes concrètes avant vendredi.", archetype: "terrain", mirror: "C'est précisément l'objet de cette consultation. Votre diagnostic est posé. Votre ordonnance vous attend." }
                        ]
                    },
                    lancement: {
                        question: (ctx) => `Si dans douze mois votre activité ${ctx.prep} est toujours au même stade de survie sans salaire net, quel sera votre constat ?`,
                        options: [
                            { letter: "A", text: "Une fureur destructrice contre moi-même d'avoir encore laissé filer trois cent soixante-cinq jours dans le vide.", archetype: "perfectionniste", mirror: "Cette fureur doit vous servir de détonateur immédiat. Ce n'est pas le talent qui vous manque, c'est l'exigence d'une méthode de terrain implacable." },
                            { letter: "B", text: "Une résignation amère : je finirai par accepter que l'indépendance financière n'était pas faite pour moi.", archetype: "intimide", mirror: "C'est la fin la plus tragique : l'abandon silencieux avant même d'avoir livré une vraie guerre commerciale sur le terrain." },
                            { letter: "C", text: "L'angoisse grandissante d'arriver au bout de ma vie active sans jamais avoir bâti d'actif solide pour les miens.", archetype: "mendiant", mirror: "Vos proches n'ont pas besoin de vos promesses de projets futurs : ils ont besoin de vous voir ramener des victoires réelles." },
                            { letter: "D", text: "C'est rigoureusement impossible : la rupture commence aujourd'hui et j'applique le protocole de terrain sans délai.", archetype: "terrain", mirror: "C'est précisément l'objet de cette consultation. Découvrez maintenant votre autopsie clinique et vos règles de redressement." }
                        ]
                    },
                    installe: {
                        question: (ctx) => `Si dans douze mois votre activité ${ctx.prep} est toujours au même niveau de stagnation sans rentabilité nette, quel sera votre verdict personnel ?`,
                        options: [
                            { letter: "A", text: "Une fureur froide contre moi-même d'avoir su exactement ce qui clochait sans jamais avoir agi avec la rigueur nécessaire.", archetype: "perfectionniste", mirror: "La différence entre stagnation et réussite tient souvent à une seule décision que l'on reporte depuis plusieurs trimestres." },
                            { letter: "B", text: "La résignation progressive : j'envisagerai sérieusement de clore l'activité et de retourner en emploi salarié.", archetype: "intimide", mirror: "Avant de fermer, avez-vous refondu votre modèle, votre pricing ou votre positionnement ? La fermeture est la décision irréversible." },
                            { letter: "C", text: "L'impossibilité de continuer à financer une activité non rentable sur mes propres deniers et mon énergie personnelle.", archetype: "mendiant", mirror: "Ce point de rupture est sain. Il est temps d'une revue chirurgicale du modèle : quoi garder, quoi supprimer, quoi refaire." },
                            { letter: "D", text: "Rigoureusement inacceptable. Je prends maintenant les décisions structurelles que j'ai différées depuis trop longtemps.", archetype: "terrain", mirror: "C'est la posture du dirigeant qui reprend le contrôle. Votre diagnostic est posé. Agissez sans délai supplémentaire." }
                        ]
                    }
                }
            }
        ],

        en: [
            {
                id: 1, label: "Act I · Gestation and Suspended Time",
                quote: "An idea does not mature in a notebook. It grows stale, loses its edge, and eventually numbs you. Waiting is almost never strategic prudence: it is terror of facing market reality in full view of your community.",
                stages: {
                    idee: {
                        question: (ctx) => `How long has the idea of ${ctx.businessShortLabel} been circulating in your mind without a single paying client ${ctx.prep}?`,
                        options: [
                            { letter: "A", text: "Under 3 months. The idea is fresh and I am actively building my launch plan.", archetype: "theoricien", mirror: "Good momentum. But without market confrontation in the next 15 days, this idea joins the graveyard of unexecuted plans." },
                            { letter: "B", text: "3 to 12 months. Waiting for the right moment, the right capital, the right conditions.", archetype: "perfectionniste", mirror: "The right moment will never materialize. Every day you wait, a competitor serves the client you could have had." },
                            { letter: "C", text: "1 to 3 years. Still refining the concept to be perfectly ready before committing to the market.", archetype: "intimide", mirror: "Three years of refining without testing. You are no longer preparing: you are procrastinating with discipline." },
                            { letter: "D", text: "Over 3 years. Economic conditions and the local context are never truly favorable to launch.", archetype: "mendiant", mirror: "Economic conditions do not launch enterprises. Courageous decisions do." }
                        ]
                    },
                    lancement: {
                        question: (ctx) => `How long has ${ctx.businessShortLabel} been operating without paying you a consistent net salary ${ctx.prep}?`,
                        options: [
                            { letter: "A", text: "Under 3 months. The business is barely off the ground, first sales are trickling in.", archetype: "theoricien", mirror: "Still fragile. Channel all your energy into direct client acquisition, not website optimization or branding." },
                            { letter: "B", text: "3 to 12 months. Sales are erratic and I cannot yet pay myself a regular salary.", archetype: "perfectionniste", mirror: "Past 6 months without a salary, it is your commercial routine that is broken, not your product." },
                            { letter: "C", text: "Over 12 months. Revenue exists but is insufficient to pay myself a decent executive salary.", archetype: "intimide", mirror: "A year without salary is a year of unpaid volunteer work in your own enterprise. A commercial pivot is now mandatory." },
                            { letter: "D", text: "Several years. The operation runs but has never crossed the threshold of a sustainable net income.", archetype: "mendiant", mirror: "Sustaining an activity that does not feed you for several years is an elaborate form of self-deception. Pivot or stop." }
                        ]
                    },
                    installe: {
                        question: (ctx) => `Your business has been running for over a year ${ctx.prep}. How long has it been stagnating without achieving the net profitability you target?`,
                        options: [
                            { letter: "A", text: "Net profitability is achieved and growing. I am now seeking to optimize and structure for scale.", archetype: "terrain", mirror: "You validated the model. The game now is margin optimization and building durable growth architecture." },
                            { letter: "B", text: "6 to 18 months of stagnation. Revenue is present but net margin remains insufficient.", archetype: "perfectionniste", mirror: "Revenue exists but net margin is missing. Your cost structure or pricing is broken, not your market." },
                            { letter: "C", text: "Over 18 months. Revenue runs but never generates net profit I can rely on.", archetype: "intimide", mirror: "You know exactly what is blocking you. Indecision on restructuring costs more than the error of acting." },
                            { letter: "D", text: "Since the beginning. I have never truly been profitable. I survive on side income or family support.", archetype: "mendiant", mirror: "An enterprise that was never profitable confirms the business model must be rebuilt from the ground up." }
                        ]
                    }
                }
            },
            {
                id: 2, label: "Act II · The Illusion of Prior Capital",
                quote: "The universal excuse: 'If only I had $20,000, everything would move fast.' But money never creates clarity. Money amplifies what already exists: a blurry proposition without capital becomes an expensive catastrophe with capital.",
                stages: {
                    idee: {
                        question: (ctx) => `To launch ${ctx.businessShortLabel} without external capital ${ctx.prep}, what is your immediate financing strategy?`,
                        options: [
                            { letter: "A", text: "Waiting for a public grant, government loan, or angel investor before starting anything.", archetype: "mendiant", mirror: "Waiting for external validation before proving your idea means outsourcing your destiny to committees that never met payroll." },
                            { letter: "B", text: "Investing personal savings into inventory or equipment before securing any orders.", archetype: "perfectionniste", mirror: "Locking capital into assets before a confirmed order is the primary cause of early-stage enterprise death." },
                            { letter: "C", text: "Sell first. The client's deposit funds execution and validates the offer before any investment.", archetype: "terrain", mirror: "Field business principle: your client validates your relevance long before any bank does." },
                            { letter: "D", text: "No detailed financial forecast yet. Will assess funding needs once first sales arrive.", archetype: "theoricien", mirror: "Flying without a forecast means crashing into a wall in good faith. Costs do not wait for your first sales." }
                        ]
                    },
                    lancement: {
                        question: (ctx) => `Your business has launched ${ctx.prep}. What is your concrete strategy to exit the financial survival zone?`,
                        options: [
                            { letter: "A", text: "Waiting on a grant or bank loan to fund the next growth phase.", archetype: "mendiant", mirror: "Public funding cannot solve a commercial problem. If your offer fails to find clients, no credit line saves you." },
                            { letter: "B", text: "Reinvesting all revenue into additional stock or equipment to scale up.", archetype: "perfectionniste", mirror: "Reinvesting before proving commercial recurrence means accelerating your cash burn without a safety net." },
                            { letter: "C", text: "Optimizing pricing, charging deposits, and cutting every cost that does not generate revenue within 30 days.", archetype: "terrain", mirror: "The only exit from survival mode: more margin per transaction and zero delivery without a confirmed deposit." },
                            { letter: "D", text: "No rigorous cash flow tracking. Managing by intuition and paying urgent bills as they arrive.", archetype: "theoricien", mirror: "Operating without a dashboard means driving at night with no headlights. Costs are precise even when revenue is not." }
                        ]
                    },
                    installe: {
                        question: (ctx) => `${ctx.prep}, your business has been running for over a year. What is your concrete approach to achieving net profitability?`,
                        options: [
                            { letter: "A", text: "Still waiting on an investor or development program to fund growth and unlock the next level.", archetype: "mendiant", mirror: "Investors demand proven traction. Without demonstrable net margin, you attract predators, not partners." },
                            { letter: "B", text: "Systematically reinvesting revenue into development without ever paying myself a real salary.", archetype: "perfectionniste", mirror: "Working unpaid in your own company for over a year is not discipline: it is tolerance of a broken model." },
                            { letter: "C", text: "Reviewing pricing structure and fixed costs to generate real net margin starting this quarter.", archetype: "terrain", mirror: "Profitability does not come with time: it comes from a surgical decision on prices and costs." },
                            { letter: "D", text: "No updated forecast. Accounting delegated with no personal monthly tracking of financials.", archetype: "theoricien", mirror: "Delegating without understanding your own P&L makes you blind to the most obvious cash leaks." }
                        ]
                    }
                }
            },
            {
                id: 3, label: "Act III · Offer Anatomy and Gross Margin",
                quote: "A business generating less than 50% to 70% gross margin on services is a dying business. Slashing prices to please everyone is the unmistakable trademark of fearful amateurs.",
                stages: {
                    idee: {
                        question: (ctx) => `How have you structured your future ${ctx.businessShortLabel} offer to be profitable from the very first client?`,
                        options: [
                            { letter: "A", text: "I will match the lowest market prices to attract maximum clients from day one.", archetype: "mendiant", mirror: "Starting at the bottom of the market attracts the most ungrateful clients. You condemn yourself to working for survival." },
                            { letter: "B", text: "My offer is comprehensive but I struggle to articulate it clearly in under 30 seconds.", archetype: "theoricien", mirror: "If you cannot explain what you solve in 30 seconds, your prospect will not understand why they should pay." },
                            { letter: "C", text: "I have a clear packaged offer with a firm price and at least 50% gross margin per engagement.", archetype: "terrain", mirror: "The right starting point: an understandable offer, an assumed price, and a margin that holds distance." },
                            { letter: "D", text: "No tariff set yet. Waiting for first contacts to gauge what people are willing to pay.", archetype: "intimide", mirror: "Letting the client set the price without an anchor exposes you to systematic downward pressure from the first negotiation." }
                        ]
                    },
                    lancement: {
                        question: (ctx) => `What is the pricing structure of ${ctx.businessShortLabel} since launch ${ctx.prep}?`,
                        options: [
                            { letter: "A", text: "Matching the lowest local market prices to win clients at any cost.", archetype: "mendiant", mirror: "A race to the bottom attracts toxic clients. You work 60 exhausting hours a week for margins that do not cover your costs." },
                            { letter: "B", text: "A complex offer that often requires detailed explanations before prospects decide to engage.", archetype: "theoricien", mirror: "Confusion kills conversion. If your proposition needs a long explanation, it is not yet market-ready." },
                            { letter: "C", text: "A high-value packaged offer with a firm, non-negotiable price per engagement.", archetype: "terrain", mirror: "The only sustainable path: serious clients who judge on results and respect expertise because you respect it first." },
                            { letter: "D", text: "Billing hourly or daily based on client requests, with no clear package or published pricing.", archetype: "intimide", mirror: "Selling hours caps your income absolutely. The moment you get sick or take vacation, your revenue stops." }
                        ]
                    },
                    installe: {
                        question: (ctx) => `After over a year of operations ${ctx.prep}, how do you manage the gross margin of ${ctx.businessShortLabel}?`,
                        options: [
                            { letter: "A", text: "Regularly discounting to retain existing clients and avoid losing them to local competition.", archetype: "mendiant", mirror: "Discounting to retain clients proves your perceived value is insufficient. Positioning retains clients, not price cuts." },
                            { letter: "B", text: "Multiple pricing tiers created but unclear on which offer to prioritize or defend.", archetype: "theoricien", mirror: "A blurry pricing architecture dilutes commercial authority. Experts defend one clear primary offer." },
                            { letter: "C", text: "Raised pricing, eliminated low-margin services, and concentrated energy on the highest-margin work.", archetype: "terrain", mirror: "The maturity of the operator: choosing your clients rather than running after every client regardless of margin." },
                            { letter: "D", text: "Rates unchanged for over a year out of fear of losing current clients if prices increase.", archetype: "intimide", mirror: "Inflation silently erodes your margin while your prices stay flat. Every month without revision impoverishes you." }
                        ]
                    }
                }
            },
            {
                id: 4, label: "Act IV · Fixed Overhead and Vanity Expenses",
                quote: "Look closely at early-stage bank statements: vanity software, oversized commercial leases, expensive branding. Founders burn cash acting like CEOs before generating a single dollar of net profit.",
                stages: {
                    idee: { question: (ctx) => `Before launching ${ctx.businessShortLabel} ${ctx.prep}, how are you planning your startup cost structure?`, options: [ { letter: "A", text: "Planning to rent commercial space or an office from day one for a professional image.", archetype: "perfectionniste", mirror: "A lease before your first client is a noose before proven demand. The market does not buy your décor." }, { letter: "B", text: "Starting from home or co-working with near-zero fixed costs until first commercial recurrence.", archetype: "terrain", mirror: "Commando discipline: no expense that does not generate revenue within 30 days." }, { letter: "C", text: "Have not estimated operational costs yet. Will assess needs as they arise.", archetype: "theoricien", mirror: "Not knowing your break-even before launching means navigating without knowing when you will sink." }, { letter: "D", text: "Delaying launch because I do not yet have the budget for all necessary tools and equipment.", archetype: "mendiant", mirror: "Perfect tools are the classic alibi. Your first clients must be served with what you have now." } ] },
                    lancement: { question: (ctx) => `How are you managing operational costs since launching ${ctx.prep}?`, options: [ { letter: "A", text: "Heavy fixed commitments already locked in (lease, multiple subscriptions) before stable client base.", archetype: "perfectionniste", mirror: "You placed a noose around your venture before proving demand. Operate lean until cash reserves overflow." }, { letter: "B", text: "Near-zero fixed overhead: every dollar spent must generate measurable revenue within 30 days.", archetype: "terrain", mirror: "The discipline of winners: no vanity, no posturing, only revenue-generating allocations." }, { letter: "C", text: "Spending without calculating acquisition cost or per-service margin.", archetype: "theoricien", mirror: "Not knowing your acquisition cost means burning cash in the dark and hoping for gold." }, { letter: "D", text: "Delaying investments because budget is insufficient for the tools I would like to have.", archetype: "mendiant", mirror: "Ideal tools are an alibi. Your first clients must be served with what is available right now." } ] },
                    installe: { question: (ctx) => `After over a year ${ctx.prep}, how do you control fixed overhead to generate positive net margin?`, options: [ { letter: "A", text: "Accumulated fixed costs weighing heavily on profitability without succeeding in reducing them.", archetype: "perfectionniste", mirror: "Uncontrolled fixed costs are a slow cancer. Every unjustified fixed expense silently reduces your freedom." }, { letter: "B", text: "Rationalized costs, renegotiated contracts, and eliminated all spending without measurable return.", archetype: "terrain", mirror: "The discipline of profitable operators: zero expense that does not generate direct or indirect measurable margin." }, { letter: "C", text: "Difficulty controlling costs because revenue varies heavily from month to month.", archetype: "theoricien", mirror: "Revenue variability does not justify uncontrolled fixed costs. A monthly dashboard resolves this structurally." }, { letter: "D", text: "Keeping significant overhead out of fear of losing quality or credibility if costs are reduced.", archetype: "intimide", mirror: "Quality is not proportional to overhead. Profitable operators do more with less." } ] }
                }
            },
            {
                id: 5, label: "Act V · Commercial Anemia and Phantom Prospecting",
                quote: "Active prospecting is the only practice that guarantees survival. Waiting passively for clients is the luxury of monopolies. In competitive markets, no one comes to your door without being personally invited.",
                stages: {
                    idee: { question: (ctx) => `What is your concrete strategy to secure your first 3 paying clients ${ctx.prep} before any other investment?`, options: [ { letter: "A", text: "Counting on personal network word-of-mouth for first clients to arrive naturally.", archetype: "intimide", mirror: "Passive referrals attract fragile clients. Real clients must be actively pursued." }, { letter: "B", text: "Building website, social media, and visual assets before any prospecting activity.", archetype: "theoricien", mirror: "Waiting for a perfect website to prospect is the classic alibi. First clients need your proposition, not your site." }, { letter: "C", text: "Directly contacting 10 qualified prospects per week by phone or in-person starting now.", archetype: "terrain", mirror: "The only method guaranteeing results before energy is exhausted. Direct contact is irreplaceable." }, { letter: "D", text: "Waiting until everything is finalized before prospecting to avoid damaging first impressions.", archetype: "perfectionniste", mirror: "Your reputation is built with clients, not with preparation. Prospect now with what you have." } ] },
                    lancement: { question: (ctx) => `What is your real weekly client acquisition routine ${ctx.prep} since launching?`, options: [ { letter: "A", text: "Relying on natural word-of-mouth and waiting for inbound contact.", archetype: "intimide", mirror: "Passive word-of-mouth is the method of hope. A business cannot survive waiting for chance to deliver clients." }, { letter: "B", text: "Posting regularly on social media hoping for inbound prospect messages.", archetype: "theoricien", mirror: "Likes do not pay invoices. Posting without a direct conversion process is elegant avoidance of selling." }, { letter: "C", text: "Directly contacting at least 10 qualified prospects per week by phone or in the field.", archetype: "terrain", mirror: "This is the only engine guaranteeing survival. Those who pick up the phone and go to the field dominate their local market." }, { letter: "D", text: "Uncomfortable with selling, waiting to find someone to handle it on my behalf.", archetype: "mendiant", mirror: "If the founder cannot sell their own service, no one will do it with the same conviction." } ] },
                    installe: { question: (ctx) => `After over a year, how have you industrialized client acquisition for ${ctx.businessShortLabel} ${ctx.prep}?`, options: [ { letter: "A", text: "Still primarily dependent on word-of-mouth with no active prospecting system.", archetype: "intimide", mirror: "Word-of-mouth always plateaus. Without an active pipeline, growth is hostage to chance and seasonality." }, { letter: "B", text: "Relying entirely on content and social media to attract prospects organically.", archetype: "theoricien", mirror: "Organic content alone is too unpredictable for an established enterprise. A structured commercial pipeline is non-negotiable." }, { letter: "C", text: "An active, measurable prospecting system with precise weekly targets consistently tracked.", archetype: "terrain", mirror: "The mark of durable businesses: prospecting is a permanent discipline, not a crisis activity." }, { letter: "D", text: "Looking to delegate acquisition but lacking the resources to hire someone to handle it.", archetype: "mendiant", mirror: "Without mastering acquisition yourself, you cannot manage a sales person. Learn to sell first." } ] }
                }
            },
            {
                id: 6, label: "Act VI · Aborted Negotiations and Phantom Recovery",
                quote: "Your client's money is yours only when it lands in your account. Invoicing without collecting is unpaid labor. A reliable payer never objects to deposits: they know serious professionals require them.",
                stages: {
                    idee: { question: (ctx) => `Before launching ${ctx.businessShortLabel} ${ctx.prep}, what rule do you set on deposits and invoicing?`, options: [ { letter: "A", text: "Will invoice after full delivery to build trust with first clients.", archetype: "theoricien", mirror: "Delivering before receiving a cent means financing your clients for free. It starts from the very first contract." }, { letter: "B", text: "50% deposit at order and balance at delivery, without exception.", archetype: "terrain", mirror: "The golden rule of launch: the deposit filters bad payers before they enter your pipeline." }, { letter: "C", text: "Flexible payment terms at the start to avoid discouraging early prospects.", archetype: "mendiant", mirror: "Financial flexibility with strangers is a classic mistake. Your payment terms define the caliber of your clients." }, { letter: "D", text: "No invoicing policy yet. Will adapt on a case-by-case basis depending on each client's request.", archetype: "intimide", mirror: "Without a payment rule before the first client, you will face your first commercial dispute completely unarmed." } ] },
                    lancement: { question: (ctx) => `Since launching ${ctx.prep}, how do you handle price negotiations and late payments?`, options: [ { letter: "A", text: "Spontaneously offering discounts to avoid losing the sale, even at zero or negative margin.", archetype: "mendiant", mirror: "The client who haggles hardest causes the most disputes later. You are signing your own systematic impoverishment." }, { letter: "B", text: "50% deposit at order, blocking all delivery until payment is received without exception.", archetype: "terrain", mirror: "Non-negotiable rule: the deposit filters bad payers at entry and secures your cash flow on every transaction." }, { letter: "C", text: "Politely waiting for payment out of social discomfort, not daring to follow up firmly.", archetype: "intimide", mirror: "Financial timidity enriches bad payers and systematically impoverishes honest, patient professionals." }, { letter: "D", text: "Delivering the full scope before invoicing, trusting the client's verbal commitment.", archetype: "theoricien", mirror: "Delivering without a deposit is a serious mistake: your leverage drops to zero once the work is completed." } ] },
                    installe: { question: (ctx) => `After over a year ${ctx.prep}, how do you structure payment conditions and collections?`, options: [ { letter: "A", text: "No firm deposit rule; adapting case-by-case depending on each client and situation.", archetype: "mendiant", mirror: "Without a uniform payment rule, each client sets the financial terms of your relationship to your detriment." }, { letter: "B", text: "Clear written terms: 50% at order, balance before delivery, late payment penalties applied without exception.", archetype: "terrain", mirror: "Installed business maturity: terms are known, respected, and defended consistently." }, { letter: "C", text: "Terms exist in theory but are regularly relaxed for important clients or sensitive situations.", archetype: "intimide", mirror: "Every exception creates a precedent. Your best clients respect your rules: others seek whoever yields." }, { letter: "D", text: "Invoicing and collections delegated with no precise personal visibility on outstanding receivables.", archetype: "theoricien", mirror: "Delegating without monitoring means discovering bad debts when it is too late to recover them." } ] }
                }
            },
            {
                id: 7, label: "Act VII · Territorial Pressure and Community Scrutiny",
                quote: "In tight-knit island ecosystems and diaspora circles, rumors and social pressure are potent poisons. Everyone watches, comments, and waits for early missteps to declare that ambition is foolish.",
                stages: {
                    idee: { question: (ctx) => `What is the primary social pressure from your circle delaying your launch decision ${ctx.prep}?`, options: [ { letter: "A", text: "Fear that close ones or the community will judge me harshly if the project does not succeed.", archetype: "intimide", mirror: "Those who never took a risk have no standing to judge your decisions. Their opinion holds zero commercial weight." }, { letter: "B", text: "Constant financial requests from family and friends who are already waiting for me to succeed.", archetype: "mendiant", mirror: "You do not distribute water from a well that has not yet been dug. Your project comes before any premature redistribution." }, { letter: "C", text: "Feeling isolated with no mentor or local role model who actually succeeded in my specific context.", archetype: "theoricien", mirror: "The absence of a local model is a discomfort, not an impossibility. Pioneers never had a predecessor by definition." }, { letter: "D", text: "None. I have clearly separated my personal life from my project and answer only to myself.", archetype: "terrain", mirror: "This clarity is the first foundation of a healthy launch decision. Protect this decisional perimeter at all costs." } ] },
                    lancement: { question: (ctx) => `Since launching ${ctx.prep}, what social friction still weighs on your decisions?`, options: [ { letter: "A", text: "Fear of local gossip and peer judgment if my venture stumbles or fails publicly.", archetype: "intimide", mirror: "Those who mock your attempt do so to soothe the shame of their own cowardice. Their comments do not pay your bills." }, { letter: "B", text: "Growing family financial requests as the venture gains any visibility or traction.", archetype: "mendiant", mirror: "Do not distribute water from an undug well. Consolidate your enterprise before attempting to redistribute." }, { letter: "C", text: "Feeling misunderstood and alone, with no high-level peers to exchange candidly on business challenges.", archetype: "theoricien", mirror: "Founder's loneliness is real but must never serve as an alibi for decisional paralysis." }, { letter: "D", text: "None. I have maintained a strict separation between professional affairs and personal life.", archetype: "terrain", mirror: "This lucidity is indispensable. Business requires surgical precision: cold on numbers, neutral on opinions." } ] },
                    installe: { question: (ctx) => `Even after over a year of operation ${ctx.prep}, what territorial pressure still limits your development?`, options: [ { letter: "A", text: "Jealousy from local competitors or former peers subtly sabotaging my reputation as I grow.", archetype: "intimide", mirror: "Others' jealousy proves you are moving forward. It does not disappear with time: learn to ignore it systematically." }, { letter: "B", text: "Family and community obligations growing heavier as the business gains visibility and income.", archetype: "mendiant", mirror: "Growth attracts requests. Without clear defended boundaries, every step forward generates a new demand." }, { letter: "C", text: "Difficulty finding serious peers to share the strategic challenges of an established field operation.", archetype: "theoricien", mirror: "Established entrepreneur networks exist. Seek them out actively rather than waiting for them to appear." }, { letter: "D", text: "None. My professional and personal lives have been strictly separated from day one.", archetype: "terrain", mirror: "This discipline is the foundation of longevity. Lasting enterprises have leaders who protect their decisional space." } ] }
                }
            },
            {
                id: 8, label: "Act VIII · Time Management and the Busy-ness Alibi",
                quote: "Entrepreneurs who fail do not lack time. They lack priorities. Constant busyness is the most sophisticated form of procrastination: absorbed by secondary tasks while decisive actions wait indefinitely.",
                stages: {
                    idee: { question: (ctx) => `How are you realistically spending your days since the idea of ${ctx.businessShortLabel} took hold ${ctx.prep}?`, options: [ { letter: "A", text: "Primarily working on branding, logos, visuals, and internal documents before any commercial contact.", archetype: "perfectionniste", mirror: "You are building the stage set before writing the play. Stop decorating and find a client this week." }, { letter: "B", text: "Consuming motivational videos, business podcasts, and online courses without taking concrete action.", archetype: "theoricien", mirror: "Information overload is a soft drug. It creates the illusion of progress while you stay completely stationary." }, { letter: "C", text: "Dedicating time every day to contacting prospects or testing the offer with real potential buyers.", archetype: "terrain", mirror: "This is the only good news in this diagnostic: you are already in contact with the field. Maintain this cadence." }, { letter: "D", text: "Days entirely occupied by employment, family obligations. No dedicated time block for the project.", archetype: "intimide", mirror: "Without sanctified morning hours for your project, it will remain a project. Two hours daily changes the trajectory." } ] },
                    lancement: { question: (ctx) => `Where did the majority of your productive hours go in the past two weeks ${ctx.prep}?`, options: [ { letter: "A", text: "Refining logo, visuals, feed content, or internal documents without contacting a single client.", archetype: "perfectionniste", mirror: "Cosmetic craftsmanship. You are repainting a store where no customer has yet walked in." }, { letter: "B", text: "Consuming motivation content, podcasts, or courses without applying anything concretely.", archetype: "theoricien", mirror: "Information addiction is a soft drug: it creates the illusion of progress while you remain seated." }, { letter: "C", text: "Negotiating with clients, delivering engagements, and following up on proposals in the field.", archetype: "terrain", mirror: "You are doing what 90% of founders refuse to do. Maintain this commercial cadence without compromise." }, { letter: "D", text: "Managing peripheral urgencies, parallel employment fatigue, or pressing family obligations.", archetype: "intimide", mirror: "If you do not protect two morning hours for your financial freedom, urgencies will consume your entire existence." } ] },
                    installe: { question: (ctx) => `After over a year, how do you allocate time between daily operations and strategic development ${ctx.prep}?`, options: [ { letter: "A", text: "Entirely absorbed by daily operations. No bandwidth to step back and pilot strategically.", archetype: "perfectionniste", mirror: "A founder trapped in operations is no longer leading: they are executing. Your role is to lift your head from the wheel." }, { letter: "B", text: "Regularly dedicating time to strategic reflection, KPI dashboards, and business development.", archetype: "terrain", mirror: "This is the transition from entrepreneur who does everything to executive who pilots. You are on the right trajectory." }, { letter: "C", text: "No real measurement of time allocation. Reacting to urgent events with no structured agenda.", archetype: "theoricien", mirror: "Without time management, your daily schedule is written by urgencies, not by your growth strategy." }, { letter: "D", text: "Exhausted by daily operations with no energy left for long-term thinking or innovation.", archetype: "intimide", mirror: "Chronic operational exhaustion signals you must delegate or restructure your offering fundamentally." } ] }
                }
            },
            {
                id: 9, label: "Act IX · Partnership Pitfalls and Governance",
                quote: "Partnering out of friendship or kinship without legal agreements is the quickest route to losing capital, business, and friendships simultaneously. A partnership is a contract of complementary interests and competencies.",
                stages: {
                    idee: { question: (ctx) => `How are you planning to structure executive leadership of your future ${ctx.businessShortLabel} ${ctx.prep}?`, options: [ { letter: "A", text: "Planning to partner with a trusted friend or family member to share risk and decisions.", archetype: "intimide", mirror: "Informal partnership without legal operating agreements is the standard startup time-bomb. When money arrives, trust evaporates." }, { letter: "B", text: "Assuming sole command, supported by contract-based deliverable service providers as needed.", archetype: "terrain", mirror: "The healthiest early configuration: unity of command prevents sterile debates and ensures maximum responsiveness." }, { letter: "C", text: "Actively seeking a co-founder to compensate for gaps in technical, sales, or administrative skills.", archetype: "mendiant", mirror: "If you do not master the fundamentals of your own model, a more experienced partner will naturally take control." }, { letter: "D", text: "Reluctant to discuss the idea publicly for fear of having it copied before I can launch and protect it.", archetype: "perfectionniste", mirror: "An unexecuted idea has zero market value. No one steals raw ideas: competitors copy only businesses generating profit." } ] },
                    lancement: { question: (ctx) => `How is executive governance structured in ${ctx.businessShortLabel} since launch ${ctx.prep}?`, options: [ { letter: "A", text: "Partnered with a close contact on verbal trust without formal shareholder agreements.", archetype: "intimide", mirror: "A ticking time-bomb. The first major profit or tax liability triggers a conflict that destroys the enterprise." }, { letter: "B", text: "Sole command supported by contract-based service providers on precise deliverables.", archetype: "terrain", mirror: "The healthiest early architecture: unity of command eliminates sterile debates and ensures maximum responsiveness." }, { letter: "C", text: "Searching for a saving partner to share financial risk and cover operational weaknesses.", archetype: "mendiant", mirror: "No one is coming to rescue you. If you do not master your model's basics, an experienced partner takes control." }, { letter: "D", text: "Afraid of delegating or sharing plans for fear of concept theft before market launch.", archetype: "perfectionniste", mirror: "An unexecuted idea has zero market value. Competitors copy only businesses that generate profit." } ] },
                    installe: { question: (ctx) => `After over a year ${ctx.prep}, how is decision-making structured in ${ctx.businessShortLabel}?`, options: [ { letter: "A", text: "Sole decision-maker, exhausted and unable to manage everything. Seeking a partner to share the load.", archetype: "intimide", mirror: "Partnering out of exhaustion is the worst reason to partner. Seek to delegate tasks first, not leadership." }, { letter: "B", text: "Defined roles, shared KPIs, and accountable service providers on precise deliverables.", archetype: "terrain", mirror: "Installed organizational maturity: every delegation euro must generate revenue or margin." }, { letter: "C", text: "Partnered but governance is unclear and disagreements slow all strategic decisions.", archetype: "mendiant", mirror: "Blurry governance with a partner is more paralyzing than operating alone. Establish rules now or separate." }, { letter: "D", text: "Extensive delegation but no clear visibility on what service providers or collaborators are actually delivering.", archetype: "perfectionniste", mirror: "Delegating without tracking metrics means financing others' improvisation with your own money." } ] }
                }
            },
            {
                id: 10, label: "Act X · The Verdict of Time and Urgent Rupture",
                quote: "Years show no mercy. While founders promise themselves to launch after the next vacation or when stability arrives, months evaporate and stamina depletes irreversibly.",
                stages: {
                    idee: { question: (ctx) => `If 12 months from today your ${ctx.businessShortLabel} project is still not launched ${ctx.prep}, what will your honest assessment be?`, options: [ { letter: "A", text: "Devastating self-fury at having let another full year evaporate without a single concrete commercial act.", archetype: "perfectionniste", mirror: "Channel that fury into immediate action. Transform it into your first concrete commercial step this week, not next month." }, { letter: "B", text: "Progressive resignation. Eventually accepting that entrepreneurship is simply not meant for me.", archetype: "intimide", mirror: "The most tragic outcome: surrendering before the fight. Your project deserves at least the test of real market exposure." }, { letter: "C", text: "Growing dread of reaching the end of my productive years without having built something solid.", archetype: "mendiant", mirror: "Your family does not need your future business plans. They need to see you taking concrete action starting today." }, { letter: "D", text: "Impossible. The break starts this week. I present my offer to 5 real people before Friday.", archetype: "terrain", mirror: "This is precisely what this consultation is for. Your diagnosis is set. Your prescription awaits." } ] },
                    lancement: { question: (ctx) => `If 12 months from today your venture ${ctx.prep} is still at the same survival level without a net salary, what will you face?`, options: [ { letter: "A", text: "Devastating self-fury over squandering another 365 days of hesitation.", archetype: "perfectionniste", mirror: "Channel that fury into immediate execution. You do not lack talent; you lack an uncompromising field discipline." }, { letter: "B", text: "Bitter resignation that financial independence was simply never intended for me.", archetype: "intimide", mirror: "The most tragic defeat: silent surrender before ever waging a real commercial campaign." }, { letter: "C", text: "Growing anxiety at approaching the end of my working years without a durable asset for my family.", archetype: "mendiant", mirror: "Your loved ones do not need future business promises: they need to see you delivering real, tangible victories now." }, { letter: "D", text: "Strictly impossible: the break begins today and I apply the field protocol without delay.", archetype: "terrain", mirror: "This is precisely what this clinical examination exists for. Discover your verdict and apply the prescription." } ] },
                    installe: { question: (ctx) => `If 12 months from today your venture ${ctx.prep} remains at this same level of stagnation without net profitability, what will your personal verdict be?`, options: [ { letter: "A", text: "Cold fury at myself for knowing exactly what was wrong and never acting with the necessary rigor.", archetype: "perfectionniste", mirror: "The gap between stagnation and success often comes down to a single decision deferred across multiple quarters." }, { letter: "B", text: "Progressive resignation: seriously considering closing the business and returning to employment.", archetype: "intimide", mirror: "Before deciding to close, have you rebuilt your business model, pricing, or positioning? Closing is the irreversible decision." }, { letter: "C", text: "The impossibility of continuing to fund a non-profitable operation on personal savings and energy.", archetype: "mendiant", mirror: "This breaking point is healthy. Time for a surgical model review: what to keep, eliminate, and rebuild." }, { letter: "D", text: "Strictly unacceptable. I am making the structural decisions I have deferred for too long, effective immediately.", archetype: "terrain", mirror: "This is the posture of the executive who reclaims control. Your diagnosis is set. Act now without further delay." } ] }
                }
            }
        ],

        es: [
            {
                id: 1, label: "Acto I · La Gestación y el Tiempo Suspendido",
                quote: "Una idea no madura en un cuaderno. Se vuelve rancia, pierde filo y termina anestesiándote. Esperar casi nunca es prudencia: es pánico a someterse a la prueba del mercado.",
                stages: {
                    idee: {
                        question: (ctx) => `¿Cuánto tiempo lleva la idea de ${ctx.businessShortLabel} circulando en su mente sin que un solo cliente haya pagado ${ctx.prep}?`,
                        options: [
                            { letter: "A", text: "Menos de 3 meses. La idea es reciente y estoy preparando activamente el plan de lanzamiento.", archetype: "theoricien", mirror: "El impulso está presente. Pero sin confrontación comercial en los próximos 15 días, esta idea se unirá al cementerio de proyectos no ejecutados." },
                            { letter: "B", text: "Entre 3 y 12 meses. Esperando el momento adecuado, el capital correcto, la oportunidad perfecta.", archetype: "perfectionniste", mirror: "El momento perfecto nunca llegará. Cada día de espera es un cliente que va directamente a su competencia." },
                            { letter: "C", text: "Entre 1 y 3 años. Aún refinando el concepto para estar completamente listo antes de lanzarme.", archetype: "intimide", mirror: "Tres años de perfeccionamiento sin probar. Ya no está preparando: está procrastinando con método." },
                            { letter: "D", text: "Más de 3 años. Las condiciones económicas y el contexto local nunca son realmente favorables.", archetype: "mendiant", mirror: "Las condiciones económicas no lanzan empresas. Las decisiones valientes, sí." }
                        ]
                    },
                    lancement: {
                        question: (ctx) => `¿Cuánto tiempo lleva ${ctx.businessShortLabel} operando sin pagarle un salario neto regular ${ctx.prep}?`,
                        options: [
                            { letter: "A", text: "Menos de 3 meses. El negocio apenas despega, las primeras ventas llegan gradualmente.", archetype: "theoricien", mirror: "Aún frágil. Concentre toda su energía en la adquisición directa de clientes, no en optimizar su sitio web." },
                            { letter: "B", text: "Entre 3 y 12 meses. Ventas irregulares, todavía no logro pagarme un salario regular.", archetype: "perfectionniste", mirror: "Pasados 6 meses sin salario, es su rutina comercial la que falla, no su producto." },
                            { letter: "C", text: "Más de 12 meses. Genero ingresos pero insuficientes para pagarme un salario digno.", archetype: "intimide", mirror: "Un año sin salario es un año de trabajo voluntario en su propia empresa. Se impone un pivote comercial inmediato." },
                            { letter: "D", text: "Varios años. Mantengo la actividad a duras penas sin nunca cruzar el umbral.", archetype: "mendiant", mirror: "Mantener una actividad que no le alimenta durante años es una forma elaborada de autoengaño. Pivote o cierre definitivo." }
                        ]
                    },
                    installe: {
                        question: (ctx) => `Su negocio lleva más de un año activo ${ctx.prep}. ¿Cuánto tiempo lleva estancado sin alcanzar la rentabilidad neta que busca?`,
                        options: [
                            { letter: "A", text: "La rentabilidad neta está lograda y en crecimiento. Busco optimizar y estructurar para escalar.", archetype: "terrain", mirror: "Validó el modelo. El juego ahora es optimizar márgenes y construir arquitectura de crecimiento durable." },
                            { letter: "B", text: "Entre 6 y 18 meses de estancamiento. Hay ingresos pero el margen neto sigue insuficiente.", archetype: "perfectionniste", mirror: "Los ingresos existen pero falta margen neto. Su estructura de costos o su pricing está roto, no su mercado." },
                            { letter: "C", text: "Más de 18 meses. Genero ingresos pero nunca obtengo un beneficio neto real en el que apoyarme.", archetype: "intimide", mirror: "Sabe exactamente qué lo bloquea. La indecisión sobre la reestructuración cuesta más que el error de actuar." },
                            { letter: "D", text: "Desde el principio. Nunca he sido realmente rentable. Sobrevivo con otros ingresos o apoyo familiar.", archetype: "mendiant", mirror: "Una actividad que nunca fue rentable confirma que el modelo económico debe rehacerse desde cero." }
                        ]
                    }
                }
            },
            {
                id: 2, label: "Acto II · La Ilusión del Financiamiento Previo",
                quote: "El pretexto universal: 'Si tuviera $20.000, todo iría rápido.' Pero el dinero nunca crea claridad. El dinero amplifica lo que ya existe: una propuesta confusa sin capital se convierte en una catástrofe con capital.",
                stages: {
                    idee: { question: (ctx) => `Para lanzar ${ctx.businessShortLabel} sin capital externo ${ctx.prep}, ¿cuál es su estrategia de financiamiento inmediata?`, options: [ { letter: "A", text: "Esperando un subsidio público, préstamo o inversor antes de hacer cualquier cosa.", archetype: "mendiant", mirror: "Esperar validación externa antes de probar su idea significa subcontratar su destino a comités que nunca pagaron nómina." }, { letter: "B", text: "Invertir ahorros personales en inventario o equipos antes de tener pedidos confirmados.", archetype: "perfectionniste", mirror: "Inmovilizar capital en activos sin pedido firme es la principal causa de muerte prematura de proyectos." }, { letter: "C", text: "Vender primero. El anticipo del primer cliente financia la ejecución antes de cualquier inversión.", archetype: "terrain", mirror: "Principio del negocio de campo: su cliente valida su relevancia mucho antes que cualquier banco." }, { letter: "D", text: "Sin proyección financiera precisa. Evaluaré necesidades cuando lleguen las primeras ventas.", archetype: "theoricien", mirror: "Volar sin proyección significa chocar contra un muro de buena fe. Los costos no esperan sus primeras ventas." } ] },
                    lancement: { question: (ctx) => `Su negocio acaba de lanzar ${ctx.prep}. ¿Cuál es su estrategia para salir de la zona de supervivencia financiera?`, options: [ { letter: "A", text: "Esperando un subsidio o préstamo bancario para financiar la siguiente fase de crecimiento.", archetype: "mendiant", mirror: "El financiamiento público no resolverá un problema comercial. Si la oferta no encuentra clientes, ningún crédito lo salva." }, { letter: "B", text: "Reinvirtiendo todos los ingresos en más inventario o equipo para crecer.", archetype: "perfectionniste", mirror: "Reinvertir antes de probar la recurrencia comercial significa acelerar su consumo de caja sin red de seguridad." }, { letter: "C", text: "Optimizando precios, cobrando anticipos y eliminando todo gasto que no genere ingresos en 30 días.", archetype: "terrain", mirror: "La única salida de la supervivencia: más margen por transacción y cero entrega sin anticipo confirmado." }, { letter: "D", text: "Sin seguimiento preciso del flujo de caja. Gestionando por intuición y pagando urgencias al aparecer.", archetype: "theoricien", mirror: "Operar sin tablero significa conducir de noche sin luces. Los costos son precisos aunque los ingresos no lo sean." } ] },
                    installe: { question: (ctx) => `${ctx.prep}, su negocio lleva más de un año activo. ¿Cuál es su enfoque concreto para alcanzar la rentabilidad neta?`, options: [ { letter: "A", text: "Aún esperando un inversor o programa de apoyo para financiar el crecimiento.", archetype: "mendiant", mirror: "Los inversores exigen tracción probada. Sin margen neto demostrable, atraerá depredadores, no socios." }, { letter: "B", text: "Reinvirtiendo sistemáticamente en desarrollo sin nunca pagarme un salario real.", archetype: "perfectionniste", mirror: "Trabajar gratis en su propia empresa por más de un año no es disciplina: es tolerancia de un modelo roto." }, { letter: "C", text: "Revisando estructura de precios y costos fijos para generar margen neto real este trimestre.", archetype: "terrain", mirror: "La rentabilidad no llega con el tiempo: llega de una decisión quirúrgica sobre precios y costos." }, { letter: "D", text: "Sin proyección actualizada. Contabilidad delegada sin seguimiento mensual personal de los números.", archetype: "theoricien", mirror: "Delegar sin entender su propio P&L lo vuelve ciego a las fugas de caja más obvias." } ] }
                }
            },
            {
                id: 3, label: "Acto III · Anatomía de la Oferta y Margen Bruto",
                quote: "Un negocio que no genera entre 50% y 70% de margen bruto en sus servicios es un negocio moribundo. Reventar precios para agradar a todos es la marca registrada de los aficionados asustados.",
                stages: {
                    idee: { question: (ctx) => `¿Cómo ha estructurado su futura oferta de ${ctx.businessShortLabel} para ser rentable desde el primer cliente?`, options: [ { letter: "A", text: "Igualaré los precios más bajos del mercado para atraer el máximo de clientes desde el inicio.", archetype: "mendiant", mirror: "Empezar por el fondo del mercado atrae los clientes más ingratos. Se condena a trabajar para sobrevivir." }, { letter: "B", text: "Mi oferta es completa pero me cuesta explicarla con claridad en menos de 30 segundos.", archetype: "theoricien", mirror: "Si no puede explicar qué resuelve en 30 segundos, su prospecto no entenderá por qué pagar." }, { letter: "C", text: "Tengo una oferta clara, un precio firme y al menos 50% de margen bruto por servicio.", archetype: "terrain", mirror: "El punto de partida correcto: oferta comprensible, precio asumido, margen que aguanta la distancia." }, { letter: "D", text: "Aún no he fijado tarifa. Esperaré los primeros contactos para ver qué están dispuestos a pagar.", archetype: "intimide", mirror: "Dejar que el cliente fije el precio sin anclaje previo lo expone sistemáticamente a presión hacia la baja." } ] },
                    lancement: { question: (ctx) => `¿Cuál es la estructura tarifaria de ${ctx.businessShortLabel} desde el lanzamiento ${ctx.prep}?`, options: [ { letter: "A", text: "Igualando los precios más bajos del mercado local para ganar clientes a cualquier costo.", archetype: "mendiant", mirror: "La guerra de precios atrae los clientes más tóxicos. Trabaja 60 horas semanales por márgenes que no cubren sus costos." }, { letter: "B", text: "Una oferta compleja que requiere explicaciones detalladas antes de que los prospectos decidan.", archetype: "theoricien", mirror: "La confusión mata la conversión. Si su propuesta exige explicación larga, aún no está lista para el mercado." }, { letter: "C", text: "Una oferta empaquetada de alto valor percibido con precio firme y no negociable.", archetype: "terrain", mirror: "El único camino sostenible: clientes serios que juzgan por resultados y respetan la experiencia." }, { letter: "D", text: "Facturando por hora o día según solicitudes, sin paquete claro ni precio publicado.", archetype: "intimide", mirror: "Vender horas limita absolutamente sus ingresos. En cuanto enferma o se va de vacaciones, sus ingresos se detienen." } ] },
                    installe: { question: (ctx) => `Tras más de un año de operaciones ${ctx.prep}, ¿cómo gestiona el margen bruto de ${ctx.businessShortLabel}?`, options: [ { letter: "A", text: "Aplicando descuentos regulares para fidelizar clientes existentes y evitar perderlos.", archetype: "mendiant", mirror: "Descontar para retener clientes prueba que su valor percibido es insuficiente. El posicionamiento fideliza, no el precio." }, { letter: "B", text: "Múltiples niveles de precio creados pero sin claridad sobre cuál defender o priorizar.", archetype: "theoricien", mirror: "Una arquitectura de precios borrosa diluye la autoridad comercial. Los expertos defienden una oferta principal clara." }, { letter: "C", text: "Elevé precios, eliminé servicios poco rentables y concentré energía en los márgenes más altos.", archetype: "terrain", mirror: "La madurez del operador: elegir sus clientes en lugar de correr detrás de todos sin discriminar." }, { letter: "D", text: "Tarifas sin cambiar por más de un año por miedo a perder clientes actuales si subo precios.", archetype: "intimide", mirror: "La inflación erosiona silenciosamente su margen sin tocar sus precios. Cada mes sin revisión lo empobrece." } ] }
                }
            },
            {
                id: 4, label: "Acto IV · El Pozo de los Costos Fijos y Gastos Inútiles",
                quote: "Observe los gastos de un emprendimiento incipiente: suscripciones prescindibles, locales sobredimensionados, branding costoso. Se gasta para parecer empresario antes de generar un solo centavo de beneficio neto.",
                stages: {
                    idee: { question: (ctx) => `Antes de lanzar ${ctx.businessShortLabel} ${ctx.prep}, ¿cómo planifica sus costos de arranque?`, options: [ { letter: "A", text: "Planeo alquilar local o oficina desde el primer día para proyectar imagen profesional.", archetype: "perfectionniste", mirror: "Un local antes del primer cliente es una soga antes de demostrar su modelo. El mercado no compra su decoración." }, { letter: "B", text: "Empiezo desde casa o coworking con costos fijos cercanos a cero hasta la primera recurrencia.", archetype: "terrain", mirror: "Disciplina de comando: ningún gasto que no genere ingresos en los próximos 30 días." }, { letter: "C", text: "Aún no he estimado costos operativos. Los evaluaré según vayan surgiendo las necesidades.", archetype: "theoricien", mirror: "No conocer su punto de equilibrio antes de lanzar significa navegar sin saber cuándo se hundirá." }, { letter: "D", text: "Retrasando el lanzamiento porque no tengo presupuesto para todas las herramientas necesarias.", archetype: "mendiant", mirror: "Las herramientas perfectas son el alibi clásico. Sus primeros clientes deben ser atendidos con lo que tiene ahora." } ] },
                    lancement: { question: (ctx) => `¿Cómo gestiona sus costos operativos desde el lanzamiento ${ctx.prep}?`, options: [ { letter: "A", text: "Compromisos fijos pesados (alquiler, múltiples suscripciones) antes de tener base de clientes estable.", archetype: "perfectionniste", mirror: "Se puso una soga al cuello antes de demostrar la demanda. Opere liviano hasta que la caja rebose." }, { letter: "B", text: "Costos fijos mínimos: cada peso/euro gastado debe generar ingresos medibles en 30 días.", archetype: "terrain", mirror: "La disciplina de los ganadores: cero vanidad, cero postura, solo asignaciones productivas." }, { letter: "C", text: "Gastando sin calcular costo de adquisición ni margen real por servicio.", archetype: "theoricien", mirror: "No conocer el costo de adquisición es quemar efectivo a oscuras esperando que salga oro." }, { letter: "D", text: "Postergando inversiones porque el presupuesto es insuficiente para las herramientas que querría tener.", archetype: "mendiant", mirror: "Las herramientas ideales son un alibi. Sus primeros clientes deben ser atendidos con lo disponible ahora mismo." } ] },
                    installe: { question: (ctx) => `Tras más de un año ${ctx.prep}, ¿cómo controla sus costos fijos para generar margen neto positivo?`, options: [ { letter: "A", text: "Costos fijos acumulados que pesan en la rentabilidad sin lograr realmente reducirlos.", archetype: "perfectionniste", mirror: "Los costos fijos no controlados son un cáncer lento. Cada euro injustificado reduce silenciosamente su libertad." }, { letter: "B", text: "Costos racionalizados, contratos renegociados, todos los gastos sin retorno medible eliminados.", archetype: "terrain", mirror: "La disciplina de los operadores rentables: cero gasto que no genere margen directo o indirecto verificable." }, { letter: "C", text: "Dificultad para controlar costos porque los ingresos varían mucho de mes a mes.", archetype: "theoricien", mirror: "La variabilidad de ingresos no justifica costos fijos sin pilotar. Un tablero mensual resuelve esto estructuralmente." }, { letter: "D", text: "Manteniendo costos elevados por temor a perder calidad o credibilidad si los reduzco.", archetype: "intimide", mirror: "La calidad no es proporcional a los costos. Los operadores rentables hacen más con menos." } ] }
                }
            },
            {
                id: 5, label: "Acto V · Anemia Comercial y Prospección Fantasma",
                quote: "La prospección activa es la única práctica que garantiza la supervivencia. Esperar pasivamente a que lleguen clientes es el lujo de los monopolios. En mercados competitivos, nadie toca a su puerta sin ser invitado personalmente.",
                stages: {
                    idee: { question: (ctx) => `¿Cuál es su estrategia concreta para conseguir sus primeros 3 clientes pagadores ${ctx.prep} antes de cualquier otra inversión?`, options: [ { letter: "A", text: "Confiar en el boca a boca de mi red personal para que los primeros clientes lleguen naturalmente.", archetype: "intimide", mirror: "Las referencias pasivas atraen clientes frágiles. Los clientes reales deben ser activamente buscados." }, { letter: "B", text: "Construir primero sitio web, redes sociales y materiales visuales antes de cualquier prospección.", archetype: "theoricien", mirror: "Esperar un sitio perfecto para prospectar es el alibi clásico. Sus primeros clientes necesitan su propuesta, no su sitio." }, { letter: "C", text: "Contactar directamente 10 prospectos calificados por semana por teléfono o en persona, desde ahora.", archetype: "terrain", mirror: "El único método que garantiza resultados antes de que su energía se agote. El contacto directo es insustituible." }, { letter: "D", text: "Esperar hasta tener todo finalizado antes de prospectar para no dañar la primera impresión.", archetype: "perfectionniste", mirror: "Su reputación se construye con clientes, no con preparativos. Prospecte ahora con lo que tiene." } ] },
                    lancement: { question: (ctx) => `¿Cuál es su rutina semanal real de adquisición de clientes ${ctx.prep} desde el lanzamiento?`, options: [ { letter: "A", text: "Confiando en el boca a boca natural y esperando contacto espontáneo.", archetype: "intimide", mirror: "El boca a boca pasivo es el método de la esperanza. Un negocio no puede sobrevivir esperando que el azar envíe clientes." }, { letter: "B", text: "Publicando regularmente en redes sociales esperando mensajes entrantes de prospectos.", archetype: "theoricien", mirror: "Los likes no pagan facturas. Publicar sin proceso de conversión directa es evitar elegantemente el acto de vender." }, { letter: "C", text: "Contactando directamente al menos 10 prospectos calificados por semana por teléfono o en campo.", archetype: "terrain", mirror: "Este es el único motor que garantiza la supervivencia. Quienes llaman y van al campo dominan su mercado local." }, { letter: "D", text: "Incómodo con las ventas, esperando encontrar a alguien que lo haga en mi lugar.", archetype: "mendiant", mirror: "Si el fundador no puede vender su propio servicio, nadie lo hará con la misma convicción." } ] },
                    installe: { question: (ctx) => `Tras más de un año, ¿cómo ha industrializado la adquisición de clientes de ${ctx.businessShortLabel} ${ctx.prep}?`, options: [ { letter: "A", text: "Aún dependiendo principalmente del boca a boca sin sistema activo de prospección.", archetype: "intimide", mirror: "El boca a boca siempre se estanca. Sin pipeline activo, el crecimiento es rehén del azar y la estacionalidad." }, { letter: "B", text: "Apostando todo por el contenido y redes sociales para atraer prospectos orgánicamente.", archetype: "theoricien", mirror: "El contenido orgánico solo es demasiado impredecible para una empresa establecida. Se necesita pipeline comercial estructurado." }, { letter: "C", text: "Un sistema de prospección activo y medible con objetivos semanales precisos y seguidos.", archetype: "terrain", mirror: "La marca de los negocios que perduran: la prospección es disciplina permanente, no actividad de crisis." }, { letter: "D", text: "Queriendo delegar la adquisición pero sin recursos para contratar a alguien que lo gestione.", archetype: "mendiant", mirror: "Sin dominar usted mismo la adquisición, no podrá gestionar un vendedor. Aprenda a vender primero." } ] }
                }
            },
            {
                id: 6, label: "Acto VI · Negociaciones Abortadas y Cobros Fantasma",
                quote: "El dinero de su cliente solo es suyo cuando entra en su cuenta. Facturar sin cobrar es trabajo no remunerado. El buen pagador nunca objeta los anticipos: sabe que los profesionales serios los exigen.",
                stages: {
                    idee: { question: (ctx) => `Antes de lanzar ${ctx.businessShortLabel} ${ctx.prep}, ¿qué regla establece sobre anticipos y facturación?`, options: [ { letter: "A", text: "Facturaré tras la entrega completa para generar confianza con los primeros clientes.", archetype: "theoricien", mirror: "Entregar antes de recibir un centavo significa financiar a sus clientes gratis. Comienza desde el primer contrato." }, { letter: "B", text: "50% de anticipo al pedido y saldo en la entrega, sin excepción.", archetype: "terrain", mirror: "La regla de oro del arranque: el anticipo filtra a los malos pagadores antes de que entren a su pipeline." }, { letter: "C", text: "Condiciones flexibles al inicio para no desanimar a los primeros prospectos potenciales.", archetype: "mendiant", mirror: "La flexibilidad financiera con extraños es un error clásico. Sus condiciones comerciales definen el calibre de sus clientes." }, { letter: "D", text: "Sin política de facturación aún. Adaptaré caso por caso según lo que pida cada cliente.", archetype: "intimide", mirror: "Sin regla de pago antes del primer cliente, enfrentará su primer litigio comercial completamente desarmado." } ] },
                    lancement: { question: (ctx) => `Desde el lanzamiento ${ctx.prep}, ¿cómo gestiona las negociaciones de precio y los retrasos en pagos?`, options: [ { letter: "A", text: "Ofreciendo descuentos espontáneamente para no perder la venta, aunque sea con margen cero.", archetype: "mendiant", mirror: "El cliente que regatea más fuerte causa más conflictos después. Firma su empobrecimiento sistemático." }, { letter: "B", text: "50% de anticipo al pedido, bloqueando toda entrega hasta recibir el pago, sin excepción.", archetype: "terrain", mirror: "Regla de hierro indispensable: el anticipo filtra malos pagadores en la entrada y asegura su flujo de caja." }, { letter: "C", text: "Esperando cortésmente los pagos por pudor, sin atreverse a reclamar firmemente.", archetype: "intimide", mirror: "El pudor financiero enriquece a los malos pagadores y empobrece sistemáticamente a los profesionales honestos." }, { letter: "D", text: "Entregando el trabajo completo antes de facturar, confiando en la palabra del cliente.", archetype: "theoricien", mirror: "Entregar sin anticipo es un error grave: su poder de negociación cae a cero una vez completado el trabajo." } ] },
                    installe: { question: (ctx) => `Tras más de un año ${ctx.prep}, ¿cómo estructura sus condiciones de pago y cobros?`, options: [ { letter: "A", text: "Sin regla firme de anticipo, adaptando caso por caso según cada cliente y situación.", archetype: "mendiant", mirror: "Sin regla uniforme de pago, cada cliente define los términos financieros de su relación en su detrimento." }, { letter: "B", text: "Términos escritos claros: 50% al pedido, saldo antes de entrega, penalidades aplicadas sin excepción.", archetype: "terrain", mirror: "Madurez de empresa establecida: condiciones conocidas, respetadas y defendidas consistentemente." }, { letter: "C", text: "Términos existen en teoría pero se relajan regularmente para clientes importantes o situaciones delicadas.", archetype: "intimide", mirror: "Cada excepción crea un precedente. Sus mejores clientes respetan sus reglas: los demás buscan quien cede." }, { letter: "D", text: "Facturación y cobros delegados sin visibilidad precisa personal sobre cuentas por cobrar pendientes.", archetype: "theoricien", mirror: "Delegar sin monitorear significa descubrir las deudas incobrables cuando ya es demasiado tarde." } ] }
                }
            },
            {
                id: 7, label: "Acto VII · Presión Territorial y Mirada del Entorno",
                quote: "En nuestras comunidades isleñas y diásporas, los rumores y la presión social son venenos potentes. Todos observan, opinan y esperan el primer tropiezo para declarar que la ambición es una locura.",
                stages: {
                    idee: { question: (ctx) => `¿Cuál es la principal presión social de su entorno que retrasa su decisión de lanzar ${ctx.prep}?`, options: [ { letter: "A", text: "Miedo a que cercanos o comunidad me juzguen duramente si el proyecto no tiene éxito.", archetype: "intimide", mirror: "Quienes nunca tomaron riesgos no tienen derecho a juzgar sus decisiones. Su opinión no tiene ningún peso comercial." }, { letter: "B", text: "Solicitudes financieras constantes de familia y amigos que ya esperan que tenga éxito.", archetype: "mendiant", mirror: "No reparta agua de un pozo que aún no ha terminado de cavar. Su proyecto va antes que cualquier redistribución prematura." }, { letter: "C", text: "Sentirse aislado sin mentor ni modelo local que haya triunfado realmente en mi contexto.", archetype: "theoricien", mirror: "La ausencia de modelo local es una incomodidad, no una imposibilidad. Los pioneros nunca tuvieron predecesor por definición." }, { letter: "D", text: "Ninguna. He separado claramente mi vida personal de mi proyecto y solo respondo ante mí mismo.", archetype: "terrain", mirror: "Esta claridad es el primer fundamento de una decisión de lanzamiento saludable. Proteja este perímetro decisional." } ] },
                    lancement: { question: (ctx) => `Desde que lanzó ${ctx.prep}, ¿qué fricción social sigue pesando sobre sus decisiones?`, options: [ { letter: "A", text: "Miedo a los chismes locales y al juicio de cercanos si el negocio tropieza o fracasa públicamente.", archetype: "intimide", mirror: "Quienes se burlan de su intento lo hacen para calmar la vergüenza de su propia cobardía. Sus comentarios no pagan sus facturas." }, { letter: "B", text: "Solicitudes financieras familiares que crecen a medida que la actividad gana visibilidad.", archetype: "mendiant", mirror: "No reparta agua de un pozo sin terminar de cavar. Consolide su empresa antes de intentar redistribuir." }, { letter: "C", text: "Sentirse incomprendido y solo, sin pares de alto nivel con quienes intercambiar candidamente.", archetype: "theoricien", mirror: "La soledad del fundador es real pero nunca debe servir de alibi para la parálisis decisional." }, { letter: "D", text: "Ninguna. Mantuve separación estricta entre asuntos profesionales y vida personal.", archetype: "terrain", mirror: "Esta lucidez es indispensable. Los negocios exigen precisión quirúrgica: frío ante los números, neutro ante las opiniones." } ] },
                    installe: { question: (ctx) => `Incluso tras más de un año activo ${ctx.prep}, ¿qué presión territorial aún limita su desarrollo?`, options: [ { letter: "A", text: "Celos de competidores locales o ex-cercanos que sabotean sutilmente mi reputación al crecer.", archetype: "intimide", mirror: "Los celos de otros prueban que avanza. No desaparecen con el tiempo: aprenda a ignorarlos sistemáticamente." }, { letter: "B", text: "Obligaciones familiares y comunitarias que se agravan conforme el negocio gana visibilidad e ingresos.", archetype: "mendiant", mirror: "El crecimiento atrae las solicitudes. Sin límites claros y defendidos, cada avance genera una nueva demanda." }, { letter: "C", text: "Dificultad para encontrar pares serios con quienes compartir los desafíos estratégicos de una empresa establecida.", archetype: "theoricien", mirror: "Las redes de empresarios establecidos existen. Búsquelas activamente en lugar de esperar que aparezcan." }, { letter: "D", text: "Ninguna. Mi vida profesional y personal han estado estrictamente separadas desde el primer día.", archetype: "terrain", mirror: "Esta disciplina es el fundamento de la longevidad. Las empresas que perduran tienen líderes que protegen su espacio decisional." } ] }
                }
            },
            {
                id: 8, label: "Acto VIII · Gestión del Tiempo y el Alibi de la Ocupación",
                quote: "Los emprendedores que fracasan no carecen de tiempo. Carecen de prioridades. La ocupación permanente es la forma más sofisticada de procrastinación: absorbido por tareas secundarias mientras los actos decisivos esperan indefinidamente.",
                stages: {
                    idee: { question: (ctx) => `¿Cómo ocupa realmente sus días desde que la idea de ${ctx.businessShortLabel} se impuso ${ctx.prep}?`, options: [ { letter: "A", text: "Trabajando principalmente en branding, logos, visuales y documentos internos antes de cualquier contacto comercial.", archetype: "perfectionniste", mirror: "Construye el escenario antes de escribir la obra. Deje de decorar y encuentre un cliente esta semana." }, { letter: "B", text: "Consumiendo videos motivacionales, podcasts de negocios y cursos online sin pasar a la acción concreta.", archetype: "theoricien", mirror: "La sobredosis de información es una droga suave. Crea la ilusión de avanzar mientras permanece completamente estático." }, { letter: "C", text: "Dedicando tiempo cada día a contactar prospectos o probar la oferta con compradores potenciales reales.", archetype: "terrain", mirror: "Esta es la única buena noticia de este diagnóstico: ya está en contacto con el campo. Mantenga este ritmo." }, { letter: "D", text: "Días completamente ocupados por empleo, obligaciones familiares. Sin bloque de tiempo dedicado al proyecto.", archetype: "intimide", mirror: "Sin horas matutinas protegidas para su proyecto, seguirá siendo solo un proyecto. Dos horas diarias cambian la trayectoria." } ] },
                    lancement: { question: (ctx) => `¿Dónde fue la mayor parte de sus horas productivas en las últimas dos semanas ${ctx.prep}?`, options: [ { letter: "A", text: "Perfeccionando logo, visuales, feed o documentos internos sin contactar a un solo cliente.", archetype: "perfectionniste", mirror: "Es artesanía cosmética. Repinta una tienda donde aún no ha entrado ningún cliente." }, { letter: "B", text: "Consumiendo contenido motivacional, podcasts o cursos sin aplicar nada de forma concreta.", archetype: "theoricien", mirror: "La adicción a la información es una droga suave: crea la ilusión de avanzar mientras permanece sentado." }, { letter: "C", text: "Negociando con clientes, entregando servicios y dando seguimiento a propuestas en campo.", archetype: "terrain", mirror: "Hace lo que el 90% de los emprendedores se niega a hacer. Mantenga este ritmo comercial sin compromiso." }, { letter: "D", text: "Gestionando urgencias periféricas, fatiga del empleo paralelo u obligaciones familiares urgentes.", archetype: "intimide", mirror: "Si no protege dos horas matutinas para su libertad económica, las urgencias consumirán toda su existencia." } ] },
                    installe: { question: (ctx) => `Tras más de un año, ¿cómo distribuye el tiempo entre operativa diaria y desarrollo estratégico ${ctx.prep}?`, options: [ { letter: "A", text: "Completamente absorbido por la operativa diaria. Sin ancho de banda para pilotar estratégicamente.", archetype: "perfectionniste", mirror: "Un fundador atrapado en la operativa ya no lidera: ejecuta. Su rol es levantar la cabeza del volante." }, { letter: "B", text: "Dedicando tiempo regularmente a reflexión estratégica, tableros de KPI y desarrollo de negocio.", archetype: "terrain", mirror: "Esta es la transición del emprendedor que hace todo al ejecutivo que pilota. Va por el camino correcto." }, { letter: "C", text: "Sin medición real de cómo distribuyo el tiempo. Reacciono a urgencias sin agenda estructurada.", archetype: "theoricien", mirror: "Sin gestión del tiempo, su agenda la escriben las urgencias, no su estrategia de crecimiento." }, { letter: "D", text: "Agotado por la operativa diaria sin energía para pensar a largo plazo o innovar.", archetype: "intimide", mirror: "El agotamiento operativo crónico indica que debe delegar o reestructurar su oferta fundamentalmente." } ] }
                }
            },
            {
                id: 9, label: "Acto IX · Sociedades Peligrosas y Gobernanza",
                quote: "Asociarse por amistad o parentesco sin contratos mercantiles escritos es la vía más rápida para perder dinero, negocio y amistades simultáneamente. Una sociedad es un contrato de intereses y competencias complementarias.",
                stages: {
                    idee: { question: (ctx) => `¿Cómo planea estructurar la dirección ejecutiva de su futuro ${ctx.businessShortLabel} ${ctx.prep}?`, options: [ { letter: "A", text: "Planeo asociarme con un amigo o familiar de confianza para compartir riesgos y decisiones.", archetype: "intimide", mirror: "La sociedad informal sin acuerdo legal escrito es la bomba de tiempo estándar del arranque. Cuando llega el dinero, la confianza se evapora." }, { letter: "B", text: "Asumiré el mando solo, apoyado por proveedores de servicios contratados por entregables según necesidad.", archetype: "terrain", mirror: "La configuración más sana para empezar: unidad de mando evita debates estériles y garantiza máxima capacidad de respuesta." }, { letter: "C", text: "Buscando activamente un co-fundador para compensar lagunas en técnica, ventas o administración.", archetype: "mendiant", mirror: "Si no domina los fundamentos de su propio modelo, un socio más experimentado tomará naturalmente el control." }, { letter: "D", text: "Reacio a hablar de la idea públicamente por temor a que me la copien antes de lanzarla.", archetype: "perfectionniste", mirror: "Una idea sin ejecutar tiene valor de mercado nulo. Nadie roba ideas crudas: los competidores copian solo negocios rentables." } ] },
                    lancement: { question: (ctx) => `¿Cómo está estructurada la gobernanza de ${ctx.businessShortLabel} desde el lanzamiento ${ctx.prep}?`, options: [ { letter: "A", text: "Asociado con un cercano en confianza verbal sin acuerdo formal de socios.", archetype: "intimide", mirror: "Una bomba de tiempo. El primer beneficio grande o deuda fiscal desencadena un conflicto que destruye la empresa." }, { letter: "B", text: "Mando único apoyado por proveedores contratados en entregables precisos.", archetype: "terrain", mirror: "La arquitectura más sana para empezar: la unidad de mando evita debates estériles y garantiza máxima capacidad de respuesta." }, { letter: "C", text: "Buscando un socio salvador para compartir el riesgo financiero y cubrir debilidades operativas.", archetype: "mendiant", mirror: "Nadie vendrá a rescatarlo. Si no domina los fundamentos de su modelo, un socio experto tomará el control." }, { letter: "D", text: "Con miedo de delegar o compartir planes por temor al robo del concepto antes del lanzamiento.", archetype: "perfectionniste", mirror: "Una idea sin ejecutar tiene valor comercial nulo. Los competidores copian solo negocios que generan ganancias." } ] },
                    installe: { question: (ctx) => `Tras más de un año ${ctx.prep}, ¿cómo está organizada la toma de decisiones en ${ctx.businessShortLabel}?`, options: [ { letter: "A", text: "Único decisor, agotado e incapaz de gestionar todo. Busco un socio para compartir la carga.", archetype: "intimide", mirror: "Asociarse por agotamiento es la peor razón para hacerlo. Busque delegar tareas primero, no el liderazgo." }, { letter: "B", text: "Roles definidos, KPIs compartidos y proveedores responsabilizados en entregables precisos.", archetype: "terrain", mirror: "Madurez organizacional de empresa establecida: cada euro de delegación debe generar ingresos o margen." }, { letter: "C", text: "Asociado pero la gobernanza es borrosa y los desacuerdos ralentizan todas las decisiones importantes.", archetype: "mendiant", mirror: "La gobernanza borrosa con un socio es más paralizante que operar solo. Establezcan reglas ahora o separación." }, { letter: "D", text: "Amplia delegación pero sin visibilidad clara sobre lo que realmente hacen proveedores o colaboradores.", archetype: "perfectionniste", mirror: "Delegar sin seguimiento de métricas significa financiar la improvisación de otros con su propio dinero." } ] }
                }
            },
            {
                id: 10, label: "Acto X · El Veredicto del Tiempo y la Ruptura Inmediata",
                quote: "Los años no perdonan. Mientras el emprendedor se promete lanzar tras las próximas vacaciones o cuando haya estabilidad, los meses vuelan y la energía se extingue irreversiblemente.",
                stages: {
                    idee: { question: (ctx) => `Si dentro de doce meses su proyecto de ${ctx.businessShortLabel} aún no está lanzado ${ctx.prep}, ¿cuál será su evaluación honesta?`, options: [ { letter: "A", text: "Furia implacable contra mí mismo por haber dejado evaporar otro año entero sin un acto comercial concreto.", archetype: "perfectionniste", mirror: "Convierta esa furia en acción inmediata. Transfórmela en su primer paso comercial concreto esta semana, no el próximo mes." }, { letter: "B", text: "Resignación progresiva. Eventualmente aceptaré que el emprendimiento simplemente no es para mí.", archetype: "intimide", mirror: "El desenlace más trágico: rendirse antes de la batalla. Su proyecto merece al menos la prueba del mercado real." }, { letter: "C", text: "Angustia creciente de llegar al final de mis años productivos sin haber construido algo sólido.", archetype: "mendiant", mirror: "Sus seres queridos no necesitan sus planes de negocio futuros. Necesitan verle tomando acción concreta desde hoy." }, { letter: "D", text: "Imposible. La ruptura comienza esta semana. Presento mi oferta a 5 personas reales antes del viernes.", archetype: "terrain", mirror: "Esto es precisamente para lo que existe esta consulta. Su diagnóstico está listo. Su prescripción le espera." } ] },
                    lancement: { question: (ctx) => `Si dentro de doce meses su actividad ${ctx.prep} sigue en el mismo nivel de supervivencia sin salario neto, ¿qué enfrentará?`, options: [ { letter: "A", text: "Furia devastadora contra mí mismo por haber desperdiciado otros 365 días de vacilación.", archetype: "perfectionniste", mirror: "Convierta esa furia en ejecución inmediata. No le falta talento; le falta un método de campo implacable." }, { letter: "B", text: "Resignación amarga de que la independencia financiera simplemente no estaba destinada a mí.", archetype: "intimide", mirror: "La derrota más triste: rendición silenciosa antes de haber librado una campaña comercial real." }, { letter: "C", text: "Angustia creciente de llegar al final de mis años laborales sin un activo duradero para mi familia.", archetype: "mendiant", mirror: "Sus seres queridos no necesitan promesas de negocios futuros: necesitan verle conseguir victorias tangibles ahora." }, { letter: "D", text: "Estrictamente imposible: la ruptura comienza hoy y aplico el protocolo de campo sin demora.", archetype: "terrain", mirror: "Para eso existe exactamente este examen clínico. Conozca su veredicto y aplique la prescripción." } ] },
                    installe: { question: (ctx) => `Si dentro de doce meses su actividad ${ctx.prep} sigue en el mismo nivel de estancamiento sin rentabilidad neta, ¿cuál será su veredicto personal?`, options: [ { letter: "A", text: "Furia fría contra mí mismo por saber exactamente qué fallaba sin actuar con el rigor necesario.", archetype: "perfectionniste", mirror: "La diferencia entre estancamiento y éxito suele reducirse a una sola decisión diferida trimestre tras trimestre." }, { letter: "B", text: "Resignación progresiva: consideraré seriamente cerrar el negocio y volver a un empleo asalariado.", archetype: "intimide", mirror: "Antes de cerrar, ¿ha rehecho su modelo de negocio, precios o posicionamiento? Cerrar es la decisión irreversible." }, { letter: "C", text: "La imposibilidad de seguir financiando una operación no rentable con mis propios ahorros y energía.", archetype: "mendiant", mirror: "Este punto de ruptura es sano. Es hora de una revisión quirúrgica del modelo: qué conservar, eliminar y rehacer." }, { letter: "D", text: "Estrictamente inaceptable. Tomo ahora las decisiones estructurales que he diferido demasiado tiempo.", archetype: "terrain", mirror: "Esta es la postura del ejecutivo que retoma el control. Su diagnóstico está listo. Actúe ahora sin más demora." } ] }
                }
            }
        ]
    };

    // Archétypes traduits en FR, EN, ES
    const ARCHETYPES_DATABASE = {
        fr: {
            perfectionniste: {
                code: "P-01",
                title: "Le perfectionniste en fuite",
                subtitle: "Vous utilisez l'illusion du détail soigné pour masquer votre terreur de la confrontation commerciale directe.",
                body: `<p>Le diagnostic clinique de votre consultation est formel : votre premier ennemi n'est ni la concurrence locale, ni les taxes, mais votre perfectionnisme d'évitement. Vous confondez la viabilité d'une entreprise avec la sophistication de son emballage.</p><p>Vous passez des semaines à peaufiner votre identité, vos supports ou des tableaux de bord, parce que tant que ces éléments ne sont pas terminés, <strong>vous disposez d'un alibi honorable pour ne pas vendre</strong>.</p><p>Le marché ne paie pas le décor : il paie le soulagement d'une douleur urgente.</p>`,
                rules: [
                    "Interdiction formelle de retoucher votre site web ou vos supports graphiques pendant trente jours.",
                    "Obligation de présenter votre offre brute à trois prospects qualifiés avant la fin de la semaine sur une simple note écrite.",
                    "Règle de l'offre brute : si vous n'éprouvez pas un léger malaise en énonçant votre prix lors de votre premier rendez-vous, c'est que vous avez attendu beaucoup trop longtemps."
                ],
                recommendedTier: "livre"
            },
            theoricien: {
                code: "T-02",
                title: "Le spectateur théoricien",
                subtitle: "Vous accumulez des connaissances pour apaiser votre anxiété sans jamais descendre dans l'arène du marché.",
                body: `<p>Votre examen met en lumière une intoxication au savoir théorique. Vous collectionnez les formations, podcasts et masterclasses. Intellectuellement, vous maîtrisez le vocabulaire des affaires. Pratiquement, vous n'avez jamais mené une vente difficile jusqu'à son encaissement ferme.</p><p>Cette boulimie vous donne l'illusion de progresser. <strong>En réalité, vous faites du surplace dans un amphithéâtre imaginaire.</strong></p><p>Le savoir non confronté au terrain se transforme en doute et vous paralyse.</p>`,
                rules: [
                    "Cessation complète de toute consommation de vidéos ou podcasts business pendant un mois.",
                    "Mesure exclusive de vos journées au nombre d'échanges commerciaux directs menés au téléphone ou en face à face.",
                    "Sortir du virtuel : chaque négociation doit comporter une demande d'acompte ferme de 50 % à la commande."
                ],
                recommendedTier: "interactif"
            },
            intimide: {
                code: "I-03",
                title: "L'intimidé du qu'en-dira-t-on",
                subtitle: "Vous laissez la peur du jugement social et la pression de vos proches fixer les frontières de votre liberté.",
                body: `<p>Votre blocage le plus profond est d'ordre relationnel et territorial. Sur nos territoires ou au sein de la diaspora, le regard de la communauté et de la famille pèse lourdement sur vos épaules. Vous vivez dans la terreur qu'un échec écorne votre réputation locale.</p><p>En voulant plaire à tout le monde, vous étouffez votre singularité. Vous attendez qu'un proche valide votre vocation pour vous sentir légitime. <strong>Cela ne se produira jamais.</strong></p><p>Vos clients sérieux sont des inconnus impartiaux, pas votre arbre généalogique.</p>`,
                rules: [
                    "Sanctuaire du silence : ne parlez plus de vos ambitions qu'à des pairs ayant déjà risqué leurs propres économies sur le terrain.",
                    "Désolidariser votre estime personnelle de la réaction de vos proches : vos clients sérieux sont des inconnus impartiaux.",
                    "Adopter l'humilité de l'artisan : essuyer des refus au démarrage n'est pas une honte, c'est le droit d'entrée dans le monde réel."
                ],
                recommendedTier: "livre"
            },
            mendiant: {
                code: "M-04",
                title: "Le mendiant de salut financier",
                subtitle: "Vous avez fait du manque d'argent préalable l'alibi confortable de votre inaction quotidienne.",
                body: `<p>Le verdict de votre anamnèse démasque le mensonge le plus répandu : croire qu'il faut un capital conséquent, une subvention ou un prêt pour prouver la valeur d'une offre sur le terrain.</p><p>Vous passez des mois à remplir des dossiers administratifs lents. Pendant ce temps, des entrepreneurs pragmatiques signent des clients avec un simple carnet de reçus et leur téléphone portable.</p><p><strong>L'argent suit la traction, il ne la précède jamais.</strong> Si personne ne verse un acompte sur votre simple parole, aucune aide ne sauvera votre boîte.</p>`,
                rules: [
                    "Arrêt immédiat de toute demande d'aide ou de prêt tant que vous n'avez pas bouclé trois ventes en fonds propres.",
                    "Règle de la trésorerie positive : concevoir une offre où l'acompte du client finance intégralement l'exécution du service.",
                    "Suppression radicale de toutes les dépenses d'apparat (zéro local prestigieux, zéro matériel superflu)."
                ],
                recommendedTier: "interactif"
            }
        },
        en: {
            perfectionniste: {
                code: "P-01",
                title: "The Evasive Perfectionist",
                subtitle: "You weaponize detailed cosmetic busywork to dodge direct commercial confrontation.",
                body: `<p>Your clinical verdict is definitive: your primary adversary is neither regional competition nor taxes, but avoidance perfectionism. You confuse business viability with aesthetic packaging.</p><p>You spend weeks adjusting brand palettes, presentations, or internal dashboards, because as long as those tasks remain incomplete, <strong>you hold a respectable excuse to avoid cold sales</strong>.</p><p>The market does not pay for decor: it pays for the swift resolution of acute pain.</p>`,
                rules: [
                    "Strict 30-day prohibition against editing your website, branding, or graphics.",
                    "Mandatory presentation of your raw offer to three qualified prospects before the end of the week on a single written sheet.",
                    "The Raw Offer Law: if you do not experience a slight knot in your stomach quoting your price, you waited entirely too long."
                ],
                recommendedTier: "livre"
            },
            theoricien: {
                code: "T-02",
                title: "The Theoretical Spectator",
                subtitle: "You hoard abstract business knowledge to numb anxiety without stepping into the market arena.",
                body: `<p>Your assessment reveals severe intellectual intoxication. You collect business books, podcasts, and masterclasses. You speak corporate fluently, yet you have never negotiated a high-stakes sale to full deposit settlement.</p><p>This information binging gives an illusion of momentum. <strong>In reality, you sit stationary in an imaginary amphitheater.</strong></p><p>Untested knowledge turns toxic: it breeds self-doubt rather than liberation.</p>`,
                rules: [
                    "Complete 30-day moratorium on all business podcasts, masterclasses, and motivational videos.",
                    "Evaluate daily productivity strictly by the number of direct commercial calls and in-person meetings completed.",
                    "Step out of the virtual: every commercial proposal must enforce a firm 50% upfront deposit."
                ],
                recommendedTier: "interactif"
            },
            intimide: {
                code: "I-03",
                title: "The Scrutiny-Intimidated Operator",
                subtitle: "You allow social gossip and peer scrutiny to establish the boundaries of your freedom.",
                body: `<p>Your deepest bottleneck is relational and territorial. Within close-knit island communities and diaspora circles, social opinion weighs heavily. You harbor private dread that early failure will damage reputation or invite mockery from those who risk nothing.</p><p>Trying to appease everyone dilutes your edge. You wait for family validation to feel qualified. <strong>That validation will never arrive.</strong></p><p>Impartial strangers are your paying customers, not your family tree.</p>`,
                rules: [
                    "Sanctuary of silence: discuss commercial ambitions solely with peers who have risked their own capital on the ground.",
                    "Decouple personal self-worth from peer feedback: your real market consists of objective, paying buyers.",
                    "Adopt apprentice humility: early rejection is not disgrace; it is the entry fee into the real world."
                ],
                recommendedTier: "livre"
            },
            mendiant: {
                code: "M-04",
                title: "The Capital-Dependent Captive",
                subtitle: "You have turned the absence of early venture funding into the comfortable hostage of your inaction.",
                body: `<p>Your clinical verdict unmasks the most common myth: believing you require seed investment, government grants, or bank loans to validate an offer in the field.</p><p>You spend months drafting bureaucratic filings. Meanwhile, pragmatic founders close customers with a phone and a receipt book.</p><p><strong>Capital follows traction; it never precedes it.</strong> If no buyer deposits funds on your word and clarity, no grant will save your venture.</p>`,
                rules: [
                    "Immediate freeze on all loan or grant applications until you secure three paid transactions from customer funds.",
                    "Positive cashflow mandate: engineer offers where client deposits fully finance service fulfillment.",
                    "Aggressive elimination of vanity burn: zero executive leases, zero superfluous tooling."
                ],
                recommendedTier: "interactif"
            }
        },
        es: {
            perfectionniste: {
                code: "P-01",
                title: "El Perfeccionista Evasivo",
                subtitle: "Utiliza la ilusión del detalle impecable como escudo para huir de la confrontación comercial directa.",
                body: `<p>El veredicto clínico de su consulta es definitivo: su peor enemigo no es la competencia ni los impuestos, sino el perfeccionismo de evasión. Confunde la viabilidad de un negocio con la sofisticación estética de su fachada.</p><p>Pasa semanas retocando paletas, logotipos o plantillas internas, porque mientras no estén terminadas, <strong>cuenta con un pretexto honorable para no salir a vender</strong>.</p><p>El mercado no paga el decorado: paga el alivio inmediato de una necesidad urgente.</p>`,
                rules: [
                    "Prohibición formal de retocar su sitio web o material gráfico durante treinta días.",
                    "Obligación de presentar su propuesta cruda a tres prospectos antes del fin de semana en una simple hoja escrita.",
                    "Ley de la oferta cruda: si no siente una leve incomodidad al enunciar su precio, esperó demasiado tiempo."
                ],
                recommendedTier: "livre"
            },
            theoricien: {
                code: "T-02",
                title: "El Espectador Teórico",
                subtitle: "Acumula conocimientos teóricos para calmar la ansiedad sin descender jamás a la arena del mercado.",
                body: `<p>Su evaluación revela intoxicación informativa. Colecciona libros, podcasts y cursos. Domina el vocabulario empresarial, pero jamás ha cerrado una venta difícil con cobro efectivo.</p><p>Este consumo voraz le genera una falsa sensación de avance. <strong>En la realidad, permanece inmóvil en un anfiteatro imaginario.</strong></p><p>El conocimiento que no se somete a la prueba de la venta se transforma en parálisis.</p>`,
                rules: [
                    "Cese total de consumo de podcasts o vídeos motivacionales de negocios durante un mes.",
                    "Medir la productividad diaria exclusivamente por el número de contactos comerciales directos completados.",
                    "Salir de lo virtual: toda negociación debe exigir un anticipo firme del 50% al pedido."
                ],
                recommendedTier: "interactif"
            },
            intimide: {
                code: "I-03",
                title: "El Intimidado por el Qué Dirán",
                subtitle: "Permite que el temor al juicio social y la opinión familiar fijen las fronteras de su libertad económica.",
                body: `<p>Su mayor bloqueo es relacional y territorial. En comunidades insulares y círculos de la diáspora, la mirada colectiva pesa intensamente. Teme que un tropiezo dañe su reputación o desate burlas de quienes jamás arriesgan nada.</p><p>Buscar agradar a todos diluye su autoridad. Espera aprobación familiar para sentirse legítimo. <strong>Eso jamás ocurrirá.</strong></p><p>Sus verdaderos clientes son desconocidos imparciales, no su árbol genealógico.</p>`,
                rules: [
                    "Santuario del silencio: no comparta planes de negocio sino con pares que ya hayan arriesgado su propio capital.",
                    "Desvincular la autoestima de la reacción de sus conocidos: sus compradores son jueces imparciales.",
                    "Humildad de artesano: el rechazo inicial no es deshonra; es el peaje de entrada al mundo real."
                ],
                recommendedTier: "livre"
            },
            mendiant: {
                code: "M-04",
                title: "El Cautivo de la Financiación",
                subtitle: "Ha convertido la falta de capital inicial en el rehén cómodo de su inacción cotidiana.",
                body: `<p>El dictamen desvela el mito más extendido: creer que necesita fondos de inversión, préstamos bancarios o subsidios para validar una propuesta en el mercado.</p><p>Pasa meses redactando solicitudes burocráticas. Mientras tanto, operadores pragmáticos cierran clientes con un teléfono y un talonario de recibos.</p><p><strong>El dinero sigue a la tracción; jamás la precede.</strong> Si nadie deposita un anticipo en su palabra, ninguna ayuda salvará su empresa.</p>`,
                rules: [
                    "Paralización de solicitudes de préstamos o ayudas hasta cerrar tres ventas con fondos propios.",
                    "Mandato de caja positiva: diseñar ofertas donde el anticipo del cliente financie la ejecución del servicio.",
                    "Eliminación radical de gastos de apariencia: cero alquileres lujosos, cero herramientas superfluas."
                ],
                recommendedTier: "interactif"
            }
        }
    };

    // État de session
    let currentLang = "fr";
    let sessionContext = {
        territoryDetail: "Martinique",
        prep: "en Martinique",
        ecosystem: "CARAIBES",
        businessType: "service",
        businessLabel: "Prestation de service & Conseil",
        businessStage: "idee"
    };

    let currentStepIndex = 0;
    let answers = [];
    let answersHistory = [];
    let leadData = {
        prenom: "",
        nom: "",
        company: "",
        website: "",
        email: "",
        phone: "",
        revenue: "",
        problem: "",
        need: ""
    };

    // DOM Elements
    const progressWrap = document.getElementById('anam-progress-wrap');
    const progressBar = document.getElementById('anam-progress-bar');
    const progressText = document.getElementById('anam-progress-text');
    const introStep = document.getElementById('step-intro');
    const questionStep = document.getElementById('step-question');
    const captureStep = document.getElementById('step-capture');
    const resultStep = document.getElementById('step-result');

    const selectTerritory = document.getElementById('select-initial-territory');
    const selectBusinessType = document.getElementById('select-business-type');
    const selectBusinessStage = document.getElementById('select-business-stage');
    const btnStart = document.getElementById('btn-start-anamnese');
    const captureForm = document.getElementById('anam-lead-form');

    // Sélecteurs de langue dans l'en-tête
    const langBtns = document.querySelectorAll('.anam-lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const chosenLang = btn.getAttribute('data-lang');
            setLanguage(chosenLang);
        });
    });

    // Bascule linguistique manuelle et rafraîchissement UI
    function setLanguage(lang) {
        currentLang = lang;
        langBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-lang') === lang));

        const t = UI_TRANSLATIONS[lang];

        // Mettre à jour l'en-tête et l'intro
        document.querySelector('.anam-session-badge').textContent = t.sessionBadge;
        document.querySelector('.anam-lead-tag').textContent = t.leadTag;
        document.querySelector('.anam-title').textContent = t.mainTitle;
        
        const prologs = document.querySelectorAll('.anam-prologue');
        if (prologs.length >= 2) {
            prologs[0].textContent = t.prologue1;
            prologs[1].textContent = t.prologue2;
        }
        document.querySelector('.anam-prologue-warning').textContent = t.warning;

        document.querySelector('.anam-setup-title').textContent = t.setupTitle;
        document.querySelector('.anam-setup-desc').textContent = t.setupDesc;

        document.querySelector('label[for="select-initial-territory"]').textContent = t.lblTerritory;
        document.querySelector('label[for="select-business-type"]').textContent = t.lblBusinessType;
        document.querySelector('label[for="select-business-stage"]').textContent = t.lblBusinessStage;
        
        btnStart.querySelector('span').textContent = t.btnStart;

        // Mettre à jour les options de business
        updateBusinessOptions(lang);

        // Mettre à jour les textes du sas de capture
        document.querySelector('#step-capture .anam-lead-tag').textContent = t.captureTag;
        document.querySelector('#step-capture .anam-title').textContent = t.captureTitle;
        document.querySelector('label[for="lead-prenom"]').textContent = t.lblFirstName;
        document.querySelector('label[for="lead-nom"]').textContent = t.lblLastName;
        document.querySelector('label[for="lead-email"]').textContent = t.lblEmail;
        const phoneLabelEl = document.querySelector('label[for="lead-phone"]');
        if (phoneLabelEl) phoneLabelEl.textContent = t.lblPhone;
        const phoneInputEl = document.getElementById('lead-phone');
        if (phoneInputEl) phoneInputEl.placeholder = t.lblPhonePlaceholder;
        document.querySelector('#step-capture button[type="submit"] span').textContent = t.btnUnlock;
        document.querySelector('.anam-form-note').textContent = t.privacyNote;

        // Mettre à jour les solutions du résultat
        document.querySelector('.anam-solutions-header .anam-lead-tag').textContent = t.solutionsTag;
        document.querySelector('.anam-solutions-title').textContent = t.solutionsTitle;
        document.querySelector('.anam-solutions-desc').textContent = t.solutionsDesc;

        document.querySelector('#offer-card-book .anam-offer-tag').textContent = t.tier1Tag;
        document.querySelector('#offer-card-book .anam-offer-title').textContent = t.tier1Title;
        document.querySelector('#offer-card-book .anam-offer-desc').textContent = t.tier1Desc;
        document.querySelector('#offer-card-book .anam-btn-order span').textContent = t.tier1Btn;

        document.querySelector('#offer-card-tool .anam-offer-tag').textContent = t.tier2Tag;
        document.querySelector('#offer-card-tool .anam-offer-title').textContent = t.tier2Title;
        document.querySelector('#offer-card-tool .anam-offer-desc').textContent = t.tier2Desc;
        document.querySelector('#offer-card-tool .anam-btn-order span').textContent = t.tier2Btn;

        document.querySelector('.anam-coaching-tag').textContent = t.coachingTag;
        document.querySelector('.anam-coaching-title').textContent = t.coachingTitle;
        document.querySelector('.anam-coaching-desc').textContent = t.coachingDesc;
        document.querySelector('.anam-btn-coaching span').textContent = t.coachingBtn;

        const prescrHeader = document.querySelector('.anam-prescription-header');
        if (prescrHeader) prescrHeader.textContent = t.prescriptionHeader;

        const catalogLink = document.querySelector('.anam-solutions-section a[href="boutique.html"]');
        if (catalogLink) catalogLink.textContent = t.viewCatalog;

        // Mise à jour de la langue HTML et du titre d'onglet
        document.documentElement.lang = lang;
        if (lang === 'en') {
            document.title = "The Entrepreneur's Anamnesis · Clinical Truth Assessment";
        } else if (lang === 'es') {
            document.title = "La Anamnesis del Emprendedor · Diagnóstico Clínico de Verdad";
        } else {
            document.title = "L'anamnèse de l'entrepreneur · Diagnostic clinique de vérité";
        }

        // Si on est déjà en cours de question, réafficher la question dans la nouvelle langue
        if (currentStepIndex >= 1 && currentStepIndex <= 10) {
            renderQuestion(currentStepIndex);
        }
    }

    function updateBusinessOptions(lang) {
        const curType = selectBusinessType.value;
        const curStage = selectBusinessStage.value;

        selectBusinessType.innerHTML = `<option value="">${UI_TRANSLATIONS[lang].lblBusinessType}...</option>`;
        
        const bTypes = BUSINESS_OPTIONS[lang].types;
        let currentGroupEl = null;
        let lastGroup = null;

        bTypes.forEach(opt => {
            if (opt.group && opt.group !== lastGroup) {
                lastGroup = opt.group;
                currentGroupEl = document.createElement('optgroup');
                currentGroupEl.label = opt.group;
                selectBusinessType.appendChild(currentGroupEl);
            }
            const o = document.createElement('option');
            o.value = opt.value;
            o.textContent = opt.label;
            if (opt.value === curType) o.selected = true;
            if (currentGroupEl) {
                currentGroupEl.appendChild(o);
            } else {
                selectBusinessType.appendChild(o);
            }
        });

        selectBusinessStage.innerHTML = `<option value="">${UI_TRANSLATIONS[lang].lblBusinessStage}...</option>`;
        BUSINESS_OPTIONS[lang].stages.forEach(opt => {
            const o = document.createElement('option');
            o.value = opt.value;
            o.textContent = opt.label;
            if (opt.value === curStage) o.selected = true;
            selectBusinessStage.appendChild(o);
        });
    }

    // Détection automatique de la langue lors de la sélection du territoire
    selectTerritory.addEventListener('change', () => {
        const opt = selectTerritory.options[selectTerritory.selectedIndex];
        if (!opt || !opt.value) return;

        const groupLabel = (opt.parentElement && opt.parentElement.label) ? opt.parentElement.label.toLowerCase() : "";
        const optVal = opt.value.toLowerCase();

        // Si territoire anglophone -> switch EN
        if (groupLabel.includes("english") || groupLabel.includes("anglophone") || optVal.includes("(en)") || optVal.includes("jamaica") || optVal.includes("trinidad") || optVal.includes("ghana") || optVal.includes("nigeria") || optVal.includes("barbados") || optVal.includes("bahamas") || optVal.includes("kenya") || optVal.includes("london") || optVal.includes("guyana") || optVal.includes("south africa")) {
            setLanguage("en");
        }
        // Si territoire hispanophone -> switch ES
        else if (groupLabel.includes("hispano") || groupLabel.includes("spanish") || optVal.includes("(es)") || optVal.includes("dominicana") || optVal.includes("cuba") || optVal.includes("puerto rico") || optVal.includes("españa")) {
            setLanguage("es");
        }
        // Si territoire francophone -> switch FR
        else if (groupLabel.includes("franco") || groupLabel.includes("caraïbes") || groupLabel.includes("afrique") || groupLabel.includes("océan") || optVal.includes("97") || optVal.includes("paris") || optVal.includes("haïti")) {
            setLanguage("fr");
        }
    });

    // Lancement de l'auscultation
    btnStart.addEventListener('click', () => {
        const terrVal = selectTerritory.value;
        const bTypeVal = selectBusinessType.value;
        const bStageVal = selectBusinessStage.value;

        if (!terrVal) {
            alert(currentLang === 'en' ? "Please select your territory." : (currentLang === 'es' ? "Por favor seleccione su territorio." : "Veuillez sélectionner votre territoire d'attache."));
            selectTerritory.focus();
            return;
        }

        if (!bTypeVal) {
            alert(currentLang === 'en' ? "Please select your business model." : (currentLang === 'es' ? "Por favor seleccione el modelo de su negocio." : "Veuillez préciser la nature de votre activité."));
            selectBusinessType.focus();
            return;
        }

        if (!bStageVal) {
            alert(currentLang === 'en' ? "Please select your business stage." : (currentLang === 'es' ? "Por favor indique la etapa de su proyecto." : "Veuillez indiquer le stade d'avancement réel."));
            selectBusinessStage.focus();
            return;
        }

        sessionContext.territoryDetail = getTerritoryName(terrVal);
        sessionContext.prep = getTerritoryPrep(terrVal, currentLang);
        sessionContext.businessType = bTypeVal;
        sessionContext.businessLabel = selectBusinessType.options[selectBusinessType.selectedIndex].text;
        sessionContext.businessStage = bStageVal;

        // Libellé court pour insertion naturelle en milieu de phrase
        const SHORT_LABELS = {
            fr: {
                btp: "votre entreprise du BTP",
                ingenierie: "votre bureau d'études ou ingénierie",
                juridique: "votre cabinet",
                tourisme: "votre structure touristique ou conciergerie",
                services_b2b: "votre entreprise de services B2B",
                service: "votre activité de prestation de services",
                terroirs: "votre marque de terroir ou agroalimentaire",
                cosmetique: "votre marque de cosmétique ou soins",
                mode: "votre marque de mode ou accessoires",
                artisanat: "votre atelier d'artisanat",
                ecommerce: "votre boutique en ligne",
                physique: "votre commerce de proximité ou restaurant",
                agro: "votre exploitation agricole"
            },
            en: {
                btp: "your construction or trade business",
                ingenierie: "your engineering consulting firm",
                juridique: "your legal or accounting firm",
                tourisme: "your hospitality or rental business",
                services_b2b: "your B2B services business",
                service: "your professional services firm",
                terroirs: "your agri-food & specialty brand",
                cosmetique: "your cosmetics & skincare brand",
                mode: "your fashion & design brand",
                artisanat: "your crafts & design workshop",
                ecommerce: "your e-commerce brand",
                physique: "your retail store or restaurant",
                agro: "your agricultural venture"
            },
            es: {
                btp: "su empresa de construcción",
                ingenierie: "su consultoría o despacho de ingeniería",
                juridique: "su despacho legal o contable",
                tourisme: "su negocio turístico o alojamiento",
                services_b2b: "su actividad de servicios B2B",
                service: "su actividad de servicios profesionales",
                terroirs: "su marca agroalimentaria o de licores",
                cosmetique: "su marca de cosmética y cuidado",
                mode: "su marca de moda o accesorios",
                artisanat: "su taller artesanal",
                ecommerce: "su tienda online",
                physique: "su comercio local o restaurante",
                agro: "su explotación agropecuaria"
            }
        };
        sessionContext.businessShortLabel = (SHORT_LABELS[currentLang] || SHORT_LABELS.fr)[bTypeVal] || 'votre activité';

        currentStepIndex = 1;
        renderQuestion(currentStepIndex);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Rendu d'un Acte
    function renderQuestion(index) {
        introStep.classList.remove('active');
        captureStep.classList.remove('active');
        resultStep.classList.remove('active');
        questionStep.classList.add('active');
        progressWrap.style.display = 'block';

        const t = UI_TRANSLATIONS[currentLang];
        const acts = ACTS_DATABASE[currentLang] || ACTS_DATABASE.fr;
        const actData = acts[index - 1];

        // Progression
        const pct = Math.round(((index - 1) / acts.length) * 100);
        progressBar.style.width = `${pct}%`;
        progressText.textContent = `${t.stepLabel} ${index} ${t.ofLabel} ${acts.length}`;

        document.getElementById('act-label').textContent = actData.label;
        document.getElementById('act-territory-tag').textContent = `${sessionContext.territoryDetail}`;
        document.getElementById('act-quote').textContent = `« ${actData.quote} »`;
        // Résolution du contenu selon le stade d'avancement
        const stageKey = sessionContext.businessStage || 'idee';
        const stageContent = (actData.stages && actData.stages[stageKey])
            ? actData.stages[stageKey]
            : actData; // rétrocompat si pas encore migré
        document.getElementById('act-question').textContent = stageContent.question(sessionContext);

        const optionsGrid = document.getElementById('act-options');
        optionsGrid.innerHTML = '';

        const mirrorBox = document.getElementById('act-mirror');
        mirrorBox.style.display = 'none';

        const stageOptions = stageContent.options || actData.options || [];
        stageOptions.forEach((opt) => {
            const btn = document.createElement('button');
            btn.className = 'anam-option-btn';
            btn.type = 'button';
            btn.innerHTML = `
                <span class="anam-option-letter">${opt.letter}</span>
                <span class="anam-option-content">${opt.text}</span>
            `;

            btn.addEventListener('click', () => {
                optionsGrid.querySelectorAll('.anam-option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');

                answers[index - 1] = opt.archetype;
                answersHistory[index - 1] = {
                    step: index,
                    label: actData.label,
                    questionText: stageContent.question(sessionContext),
                    letter: opt.letter,
                    choiceText: opt.text,
                    mirror: opt.mirror,
                    archetype: opt.archetype
                };

                document.getElementById('act-mirror-title').textContent = t.mirrorTitle;
                document.getElementById('act-mirror-text').textContent = opt.mirror;
                document.querySelector('#btn-next-step span').textContent = t.btnNext;

                mirrorBox.style.display = 'block';
                mirrorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });

            optionsGrid.appendChild(btn);
        });

        // Bouton étape suivante
        const btnNext = document.getElementById('btn-next-step');
        btnNext.onclick = () => {
            if (!answers[index - 1]) {
                alert(currentLang === 'en' ? "Please select the option that reflects your reality." : (currentLang === 'es' ? "Por favor seleccione la opción que refleje su realidad." : "Veuillez sélectionner l'option qui correspond à votre réalité professionnelle."));
                return;
            }

            if (currentStepIndex < acts.length) {
                currentStepIndex++;
                renderQuestion(currentStepIndex);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                currentStepIndex = 11;
                renderCapture();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };
    }

    // Sas de capture
    function renderCapture() {
        questionStep.classList.remove('active');
        captureStep.classList.add('active');

        const t = UI_TRANSLATIONS[currentLang];
        progressBar.style.width = '100%';
        progressText.textContent = `${t.captureTag} · 10 ${t.stepLabel}s`;
        const confirmTerrEl = document.getElementById('confirmed-territory-display');
        if (confirmTerrEl) confirmTerrEl.textContent = `${sessionContext.territoryDetail} — ${sessionContext.businessLabel}`;
    }

    // Soumission du formulaire avec transmission exhaustive de l'intelligence business
    captureForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = captureForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = UI_TRANSLATIONS[currentLang].btnSubmitting;

        leadData.prenom = (document.getElementById('lead-prenom')?.value || '').trim();
        leadData.nom = (document.getElementById('lead-nom')?.value || '').trim();
        leadData.company = (document.getElementById('lead-company')?.value || '').trim();
        leadData.website = (document.getElementById('lead-website')?.value || '').trim();
        leadData.email = (document.getElementById('lead-email')?.value || '').trim();
        leadData.phone = (document.getElementById('lead-phone')?.value || '').trim();
        leadData.revenue = (document.getElementById('lead-revenue')?.value || '').trim();
        leadData.problem = (document.getElementById('lead-problem')?.value || '').trim();
        leadData.need = (document.getElementById('lead-need')?.value || '').trim();

        const calculatedArchetype = computeDominantArchetype(answers);

        // Transmission Formspree exhaustive
        const payload = new FormData();
        payload.append('_to', 'domtomconnect@gmail.com');
        const subjectCompany = leadData.company ? `[${leadData.company}] ` : '';
        payload.append('_subject', `[Anamnèse ${currentLang.toUpperCase()}] ${subjectCompany}${leadData.prenom} ${leadData.nom} · ${sessionContext.territoryDetail}`);
        payload.append('_replyto', leadData.email);

        // Données d'identité & Contact
        payload.append('Dirigeant', `${leadData.prenom} ${leadData.nom}`.trim());
        payload.append('Prénom', leadData.prenom);
        payload.append('Nom', leadData.nom);
        payload.append('Entreprise ou Marque', leadData.company || 'Non renseigné');
        payload.append('Site web ou Réseaux', leadData.website || 'Non renseigné');
        payload.append('Email', leadData.email);
        payload.append('Téléphone WhatsApp', leadData.phone || 'Non renseigné');

        // Cadrage territorial et financier
        payload.append('Langue', currentLang.toUpperCase());
        payload.append('Territoire d\'ancrage', sessionContext.territoryDetail);
        payload.append('Secteur d\'activité', sessionContext.businessLabel);
        payload.append('Stade d\'avancement', sessionContext.businessStage);
        payload.append('Tranche de Chiffre d\'Affaires', leadData.revenue || 'Non renseigné');
        payload.append('Blocage majeur n°1', leadData.problem || 'Non renseigné');
        payload.append('Attente prioritaire Domtom Connect', leadData.need || 'Non renseigné');
        payload.append('Profil diagnostiqué', `${calculatedArchetype.title} (Code : ${calculatedArchetype.code})`);

        // Formatage du dossier complet de diagnostic (les 10 questions détaillées)
        let auditReportText = `========================================================\n`;
        auditReportText += `DOSSIER CLINIQUE DE L'ENTREPRENEUR · DOMTOM CONNECT\n`;
        auditReportText += `========================================================\n\n`;
        auditReportText += `DIRIGEANT : ${leadData.prenom} ${leadData.nom}\n`;
        auditReportText += `ENTREPRISE / MARQUE : ${leadData.company || 'N/A'}\n`;
        auditReportText += `SITE / SOCIAL : ${leadData.website || 'N/A'}\n`;
        auditReportText += `CONTACT : ${leadData.phone || 'N/A'} | ${leadData.email}\n`;
        auditReportText += `TERRITOIRE : ${sessionContext.territoryDetail}\n`;
        auditReportText += `SECTEUR : ${sessionContext.businessLabel}\n`;
        auditReportText += `STADE : ${sessionContext.businessStage}\n`;
        auditReportText += `CA MENSUEL : ${leadData.revenue || 'N/A'}\n`;
        auditReportText += `BLOCAGE N°1 : ${leadData.problem || 'N/A'}\n`;
        auditReportText += `ATTENTE DTC : ${leadData.need || 'N/A'}\n`;
        auditReportText += `ARCHÉTYPE DIAGNOSTIQUÉ : ${calculatedArchetype.title} (${calculatedArchetype.code})\n\n`;
        auditReportText += `--------------------------------------------------------\n`;
        auditReportText += `DÉTAIL DES 10 RÉPONSES AU DIAGNOSTIC\n`;
        auditReportText += `--------------------------------------------------------\n\n`;

        answersHistory.forEach((item, idx) => {
            const qNum = idx + 1;
            const qKey = `Q${qNum < 10 ? '0' : ''}${qNum}`;
            const reponseStr = `[Option ${item.letter}] ${item.choiceText}`;
            payload.append(`${qKey} - ${item.label}`, reponseStr);
            payload.append(`${qKey} - Diagnostic miroir`, item.mirror);

            auditReportText += `[QUESTION ${qNum}] ${item.label}\n`;
            auditReportText += `Énoncé : ${item.questionText}\n`;
            auditReportText += `Choix du dirigeant : (${item.letter}) ${item.choiceText}\n`;
            auditReportText += `Miroir clinique : ${item.mirror}\n\n`;
        });

        auditReportText += `========================================================\n`;
        payload.append('DOSSIER_AUDIT_COMPLET', auditReportText);

        if (window.trackLead) {
            window.trackLead({
                source: 'anamnese-multilingual',
                action: 'diagnostic_completed',
                lang: currentLang,
                type: calculatedArchetype.code,
                territory: sessionContext.territoryDetail,
                businessType: sessionContext.businessType,
                company: leadData.company,
                revenue: leadData.revenue,
                problem: leadData.problem,
                need: leadData.need,
                email: leadData.email
            });
        }

        fetch('https://formspree.io/f/myzbqepy', {
            method: 'POST',
            body: payload,
            headers: { 'Accept': 'application/json' }
        })
        .then(() => renderResults(calculatedArchetype))
        .catch(() => renderResults(calculatedArchetype));
    });

    // Calcul de l'archétype dominant
    function computeDominantArchetype(collectedAnswers) {
        const counts = { perfectionniste: 0, theoricien: 0, intimide: 0, mendiant: 0 };
        collectedAnswers.forEach(ans => {
            if (counts[ans] !== undefined) counts[ans]++;
        });

        let maxType = "perfectionniste";
        let maxCount = -1;
        for (const [type, count] of Object.entries(counts)) {
            if (count > maxCount) {
                maxCount = count;
                maxType = type;
            }
        }

        const dict = ARCHETYPES_DATABASE[currentLang] || ARCHETYPES_DATABASE.fr;
        return dict[maxType] || dict.perfectionniste;
    }

    // Affichage des résultats
    function renderResults(arch) {
        captureStep.classList.remove('active');
        resultStep.classList.add('active');
        progressWrap.style.display = 'none';

        const t = UI_TRANSLATIONS[currentLang];
        document.getElementById('res-patient-name').textContent = `${t.reportHeader} · ${leadData.prenom} ${leadData.nom}`;
        document.getElementById('res-patient-territory').textContent = `${sessionContext.territoryDetail} · ${sessionContext.businessLabel}`;
        document.getElementById('res-archetype-code').textContent = `Code ${arch.code}`;
        document.getElementById('res-verdict-title').textContent = arch.title;
        document.getElementById('res-verdict-quote').textContent = `« ${arch.subtitle} »`;
        document.getElementById('res-verdict-body').innerHTML = arch.body;

        const rulesList = document.getElementById('res-rules-list');
        rulesList.innerHTML = '';
        arch.rules.forEach((rule, idx) => {
            const li = document.createElement('li');
            li.className = 'anam-prescription-item';
            li.innerHTML = `
                <span class="anam-prescription-bullet">0${idx + 1}.</span>
                <span>${rule}</span>
            `;
            rulesList.appendChild(li);
        });

        const cardBook = document.getElementById('offer-card-book');
        const cardTool = document.getElementById('offer-card-tool');

        if (arch.recommendedTier === 'interactif') {
            cardTool.classList.add('featured');
            cardBook.classList.remove('featured');
        } else {
            cardBook.classList.add('featured');
            cardTool.classList.remove('featured');
        }

        // ---- Carte WhatsApp Group ----
        const isIdea = (sessionContext.businessStage === 'idee' || sessionContext.businessStage === 'lancement');
        const waTitle = isIdea ? t.whatsappGroupTitleIdea : t.whatsappGroupTitleActive;
        const waDesc  = isIdea ? t.whatsappGroupDescIdea  : t.whatsappGroupDescActive;
        // Liens WhatsApp différenciés (porteurs vs entreprises actives)
        const waLink  = isIdea
            ? 'https://chat.whatsapp.com/porteurs-domtom-connect'
            : 'https://chat.whatsapp.com/actifs-domtom-connect';

        let waSection = document.getElementById('whatsapp-group-section');
        if (!waSection) {
            waSection = document.createElement('section');
            waSection.id = 'whatsapp-group-section';
            waSection.className = 'anam-whatsapp-section';
            // Insérer avant la section solutions
            const solutionsSection = document.querySelector('.anam-solutions-section');
            if (solutionsSection) {
                resultStep.insertBefore(waSection, solutionsSection);
            } else {
                resultStep.appendChild(waSection);
            }
        }

        waSection.innerHTML = `
            <div class="anam-wa-inner">
                <span class="anam-wa-tag">${t.whatsappGroupTag}</span>
                <h3 class="anam-wa-title">${waTitle}</h3>
                <p class="anam-wa-desc">${waDesc}</p>
                <a href="${waLink}" target="_blank" rel="noopener" class="anam-btn-wa">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <span>${t.whatsappGroupBtn}</span>
                </a>
            </div>
        `;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Fonction de pré-remplissage et d'adaptation via paramètres URL (?sector=... ou ?filiere=...)
    function applyUrlPreset(params) {
        const rawSector = (params.get('sector') || params.get('filiere') || params.get('pole') || '').toLowerCase().trim();
        if (!rawSector) return;

        const SECTOR_ALIASES = {
            'btp': 'btp',
            'batiment': 'btp',
            'construction': 'btp',
            'artisan-batiment': 'btp',
            'ingenierie': 'ingenierie',
            'bureau-etudes': 'ingenierie',
            'etudes': 'ingenierie',
            'conseil-technique': 'ingenierie',
            'juridique': 'juridique',
            'avocat': 'juridique',
            'notaire': 'juridique',
            'comptable': 'juridique',
            'expert-comptable': 'juridique',
            'tourisme': 'tourisme',
            'conciergerie': 'tourisme',
            'gite': 'tourisme',
            'lodge': 'tourisme',
            'hebergement': 'tourisme',
            'services_b2b': 'services_b2b',
            'services': 'services_b2b',
            'b2b': 'services_b2b',
            'terroirs': 'terroirs',
            'agroalimentaire': 'terroirs',
            'rhum': 'terroirs',
            'epicerie': 'terroirs',
            'cosmetique': 'cosmetique',
            'beaute': 'cosmetique',
            'soins': 'cosmetique',
            'capillaire': 'cosmetique',
            'mode': 'mode',
            'textile': 'mode',
            'createur': 'mode',
            'artisanat': 'artisanat',
            'artisanat-art': 'artisanat',
            'ecommerce': 'ecommerce',
            'e-commerce': 'ecommerce',
            'digital': 'ecommerce',
            'd2c': 'ecommerce',
            'physique': 'physique',
            'commerce': 'physique',
            'restauration': 'physique',
            'agro': 'agro',
            'agriculture': 'agro',
            'marques': 'terroirs'
        };

        const targetSector = SECTOR_ALIASES[rawSector] || rawSector;
        
        // Sélectionner dans le dropdown
        const selectBType = document.getElementById('select-business-type');
        if (selectBType) {
            const hasOption = Array.from(selectBType.options).some(o => o.value === targetSector);
            if (hasOption) {
                selectBType.value = targetSector;
            }
        }

        // Pré-sélectionner le stade "Entreprise installée" par défaut pour les pôles pro B2B
        const selectBStage = document.getElementById('select-business-stage');
        const stageParam = (params.get('stage') || '').toLowerCase().trim();
        if (stageParam && selectBStage) {
            selectBStage.value = stageParam;
        } else if (['btp', 'ingenierie', 'juridique', 'tourisme', 'services_b2b'].includes(targetSector) && selectBStage && !selectBStage.value) {
            selectBStage.value = 'installe';
        }

        // Pré-sélectionner le territoire si présent dans l'URL (?territory=martinique, etc.)
        const terrParam = (params.get('territory') || params.get('terr') || '').toLowerCase().trim();
        if (terrParam && selectTerritory) {
            const terrOpt = Array.from(selectTerritory.options).find(o => o.value.toLowerCase().includes(terrParam) || o.text.toLowerCase().includes(terrParam));
            if (terrOpt) selectTerritory.value = terrOpt.value;
        }

        // Afficher la bannière de calibrage sectoriel dans l'intro
        const bannerEl = document.getElementById('anam-sector-banner');
        const bannerNameEl = document.getElementById('anam-sector-banner-name');
        if (bannerEl && bannerNameEl && selectBType && selectBType.selectedIndex >= 0) {
            const chosenText = selectBType.options[selectBType.selectedIndex]?.text || targetSector.toUpperCase();
            bannerNameEl.textContent = chosenText;
            bannerEl.style.display = 'inline-flex';
        }
    }

    // Initialisation (Détection du paramètre URL ?lang=en/es/fr ou hash #en)
    const urlParams = new URLSearchParams(window.location.search);
    const initialLang = urlParams.get('lang') || window.location.hash.replace('#', '').toLowerCase();
    if (['en', 'es', 'fr'].includes(initialLang)) {
        setLanguage(initialLang);
    } else {
        setLanguage('fr');
    }

    // Détection et pré-sélection automatique du secteur via URL
    applyUrlPreset(urlParams);
});

