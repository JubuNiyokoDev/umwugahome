
import type { SeedData, Mentor } from './types';

export const seedData: SeedData = {
    users: [
        { id: 'user-artisan-1', name: 'Aline Niyonsaba', email: 'aline@umwuga.com', role: 'artisan', profileImageId: 'artisan-1' },
        { id: 'user-artisan-2', name: 'Jean-Claude Bizimana', email: 'jc.bizimana@umwuga.com', role: 'artisan', profileImageId: 'artisan-2' },
        { id: 'user-artisan-3', name: 'Marie Goretti Uwizeye', email: 'mg.uwizeye@umwuga.com', role: 'artisan', profileImageId: 'artisan-3' },
        { id: 'user-artisan-4', name: 'Eric Ndayishimiye', email: 'eric.ndayishimiye@umwuga.com', role: 'artisan', profileImageId: 'artisan-4' },
        { id: 'user-center-1', name: 'Centre de Formation Gira', email: 'contact@gira.bi', role: 'training_center', profileImageId: 'training-center-1' },
        { id: 'user-center-2', name: 'Bujumbura Creative Hub', email: 'info@bujacreative.org', role: 'training_center', profileImageId: 'training-center-2' },
        { id: 'user-admin-1', name: 'Admin Umwuga', email: 'admin@umwuga.com', role: 'admin' },
        { id: 'user-student-1', name: 'Eliane Nshimirimana', email: 'eliane.n@gmail.com', role: 'student', profileImageId: 'student-profile-1' },
        { id: 'user-mentor-1', name: 'Charlotte Niyongere', email: 'c.niyongere@umwuga.com', role: 'mentor', profileImageId: 'artisan-2' },
        { id: 'user-mentor-2', name: 'Olivier Munezero', email: 'o.munezero@umwuga.com', role: 'mentor', profileImageId: 'artisan-4' }
    ],
    artisans: [
        {
            id: 'user-artisan-1',
            userId: 'user-artisan-1',
            name: 'Aline Niyonsaba',
            craft: 'Vannerie',
            province: 'Gitega',
            bio: 'Spécialiste de la vannerie traditionnelle burundaise, je crée des paniers et des objets décoratifs uniques en utilisant des techniques ancestrales transmises de génération en génération.',
            profileImageId: 'artisan-1',
            rating: 4.8
        },
        {
            id: 'user-artisan-2',
            userId: 'user-artisan-2',
            name: 'Jean-Claude Bizimana',
            craft: 'Maroquinerie',
            province: 'Bujumbura Mairie',
            bio: 'Artisan du cuir passionné, je confectionne des sacs, ceintures et sandales de haute qualité. Chaque pièce est faite à la main avec une attention particulière aux détails.',
            profileImageId: 'artisan-2',
            rating: 4.9
        },
        {
            id: 'user-artisan-3',
            userId: 'user-artisan-3',
            name: 'Marie Goretti Uwizeye',
            craft: 'Poterie',
            province: 'Ngozi',
            bio: 'Mes créations en poterie allient fonctionnalité et art. Je puise mon inspiration dans les paysages verdoyants du Burundi pour créer des pièces uniques et authentiques.',
            profileImageId: 'artisan-3',
            rating: 4.7
        },
        {
            id: 'user-artisan-4',
            userId: 'user-artisan-4',
            name: 'Eric Ndayishimiye',
            craft: 'Sculpture sur bois',
            province: 'Muramvya',
            bio: 'Je transforme le bois local en œuvres d\'art. Mes sculptures représentent des scènes de la vie quotidienne et la riche culture de notre pays.',
            profileImageId: 'artisan-4',
            rating: 4.8
        },
    ],
    trainingCenters: [
        {
            id: 'user-center-1',
            userId: 'user-center-1',
            name: 'Centre de Formation Gira',
            province: 'Gitega',
            description: 'Le Centre Gira offre des formations professionnelles de haute qualité en coupe-couture, soudure et menuiserie, visant l\'autonomisation des jeunes.',
            imageId: 'training-center-1',
            rating: 4.5
        },
        {
            id: 'user-center-2',
            userId: 'user-center-2',
            name: 'Bujumbura Creative Hub',
            province: 'Bujumbura Mairie',
            description: 'Un espace innovant pour les créatifs. Nous proposons des formations en design graphique, web design et marketing digital pour les artisans 2.0.',
            imageId: 'training-center-2',
            rating: 4.9
        }
    ],
    products: [
        { id: 'prod-001', name: 'Panier en jonc "Umuco"', price: 25000, imageId: 'product-1', description: 'Grand panier tressé à la main, idéal pour la décoration ou le marché. Motifs traditionnels.', artisanId: 'user-artisan-1' },
        { id: 'prod-002', name: 'Sac en cuir "Kazoza"', price: 75000, imageId: 'product-2', description: 'Sac à bandoulière en cuir véritable, design moderne et élégant.', artisanId: 'user-artisan-2' },
        { id: 'prod-003', name: 'Vase en argile "Ihanga"', price: 15000, imageId: 'product-3', description: 'Vase décoratif en poterie, parfait pour apporter une touche naturelle à votre intérieur.', artisanId: 'user-artisan-3' },
        { id: 'prod-004', name: 'Sculpture "Umuryango"', price: 120000, imageId: 'product-4', description: 'Représentation stylisée d\'une famille en bois de musave.', artisanId: 'user-artisan-4' },
        { id: 'prod-005', name: 'Sous-plats en fibres de bananier', price: 18000, imageId: 'product-1', description: 'Ensemble de 6 sous-plats tressés, écologiques et durables.', artisanId: 'user-artisan-1' },
        { id: 'prod-006', name: 'Sandales en cuir "Intago"', price: 35000, imageId: 'product-2', description: 'Sandales robustes et confortables pour homme, faites pour durer.', artisanId: 'user-artisan-2' },
    ],
    courses: [
        {
            id: 'course-001',
            title: 'Initiation à la Coupe et Couture',
            duration: '3 mois',
            description: 'Apprenez les bases de la couture, de la prise de mesure à la confection de vêtements simples. Matériel de base fourni.',
            prerequisites: 'Aucun',
            imageId: 'course-2',
            centerId: 'user-center-1'
        },
        {
            id: 'course-002',
            title: 'Perfectionnement en Soudure à l\'Arc',
            duration: '2 mois',
            description: 'Approfondissez vos techniques de soudure pour réaliser des structures métalliques complexes et résistantes.',
            prerequisites: 'Bases en soudure',
            imageId: 'course-1',
            centerId: 'user-center-1'
        },
        {
            id: 'course-003',
            title: 'Web Design pour Artisans',
            duration: '6 semaines',
            description: 'Créez un site web portfolio pour présenter et vendre vos créations en ligne. Notions de WordPress et de photographie de produit.',
            prerequisites: 'Maîtrise de l\'ordinateur',
            imageId: 'training-center-2',
            centerId: 'user-center-2'
        },
        {
            id: 'course-004',
            title: 'Marketing sur les Réseaux Sociaux',
            duration: '4 semaines',
            description: 'Utilisez Instagram et Facebook pour promouvoir votre marque d\'artisan, atteindre de nouveaux clients et booster vos ventes.',
            prerequisites: 'Compte Facebook/Instagram',
            imageId: 'training-center-2',
            centerId: 'user-center-2'
        }
    ],
    mentors: [
        {
            id: 'user-mentor-1',
            userId: 'user-mentor-1',
            name: 'Charlotte Niyongere',
            expertise: 'Business Development & Export',
            province: 'Bujumbura Mairie',
            bio: 'Avec plus de 15 ans d\'expérience dans le commerce international, j\'aide les artisans à structurer leur activité, à fixer leurs prix et à trouver des débouchés à l\'étranger.',
            profileImageId: 'artisan-2', // Placeholder
            rating: 5.0
        },
        {
            id: 'user-mentor-2',
            userId: 'user-mentor-2',
            name: 'Olivier Munezero',
            expertise: 'Techniques de Production & Qualité',
            province: 'Gitega',
            bio: 'Ingénieur de formation et passionné d\'artisanat, j\'accompagne les artisans dans l\'amélioration de leurs processus de production, le contrôle qualité et l\'innovation technique.',
            profileImageId: 'artisan-4', // Placeholder
            rating: 4.9
        }
    ]
};
