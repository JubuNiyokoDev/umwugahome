
import type { SeedData, Mentor, Order } from './types';

export const seedData: SeedData = {
    users: [
        // Artisans
        { id: 'user-artisan-1', name: 'Aline Niyonsaba', email: 'aline@umwuga.com', role: 'artisan', profileImageId: '/artisant_yomugiti_image_1.jpg' },
        { id: 'user-artisan-2', name: 'Jean-Claude Bizimana', email: 'jc.bizimana@umwuga.com', role: 'artisan', profileImageId: '/artisant_yomugiti_image_2.jpg' },
        { id: 'user-artisan-3', name: 'Marie Goretti Uwizeye', email: 'mg.uwizeye@umwuga.com', role: 'artisan', profileImageId: '/ibirato_image_1.jpg' },
        { id: 'user-artisan-4', name: 'Eric Ndayishimiye', email: 'eric.ndayishimiye@umwuga.com', role: 'artisan', profileImageId: '/ibirato_image_2.jpg' },
        { id: 'user-artisan-5', name: 'Fabiola Akimana', email: 'fabiola.a@umwuga.com', role: 'artisan', profileImageId: '/ibirato_image_3.jpg' },
        { id: 'user-artisan-6', name: 'Patrick Kaneza', email: 'patrick.k@umwuga.com', role: 'artisan', profileImageId: '/event_image1_edition3.jpg' },
        { id: 'user-artisan-7', name: 'Esther Nininahazwe', email: 'esther.n@umwuga.com', role: 'artisan', profileImageId: '/event_image2_edition3.jpg' },
        { id: 'user-artisan-8', name: 'Samuel Bigirimana', email: 'samuel.b@umwuga.com', role: 'artisan', profileImageId: '/event_image3_edition3.jpg' },
        // Training Centers
        { id: 'user-center-1', name: 'Centre de Formation Gira', email: 'contact@gira.bi', role: 'training_center' },
        { id: 'user-center-2', name: 'Bujumbura Creative Hub', email: 'info@bujacreative.org', role: 'training_center' },
        { id: 'user-center-3', name: 'Académie des Métiers de Ngozi', email: 'contact@academiemetiers.bi', role: 'training_center' },
        { id: 'user-center-4', name: 'Tech & Tradition', email: 'contact@techtradition.bi', role: 'training_center' },
        // Admin
        { id: 'user-admin-1', name: 'Admin Umwuga', email: 'admin@umwuga.com', role: 'admin', profileImageId: '/event_image4_edition3.jpg' },
        // Students
        { id: 'user-student-1', name: 'Eliane Nshimirimana', email: 'eliane.n@gmail.com', role: 'student', profileImageId: '/event_image5_edition3.jpg', interests: ['Couture', 'Marketing Digital', 'Anglais des affaires'] },
        { id: 'user-student-2', name: 'Kevin Mugisha', email: 'kevin.m@gmail.com', role: 'student', profileImageId: '/ibirato_image_achat.jpg', interests: ['Design Web', 'Photographie', 'Entrepreneuriat'] },
        // Mentors
        { id: 'user-mentor-1', name: 'Charlotte Niyongere', email: 'c.niyongere@umwuga.com', role: 'mentor', profileImageId: '/artisant_yomugiti_image_1.jpg' },
        { id: 'user-mentor-2', name: 'Olivier Munezero', email: 'o.munezero@umwuga.com', role: 'mentor', profileImageId: '/artisant_yomugiti_image_2.jpg' }
    ],
    artisans: [
        { id: 'user-artisan-1', userId: 'user-artisan-1', name: 'Aline Niyonsaba', craft: 'Vannerie', province: 'Gitega', bio: 'Spécialiste de la vannerie traditionnelle burundaise, je crée des paniers et des objets décoratifs uniques en utilisant des techniques ancestrales transmises de génération en génération.', profileImageId: '/artisant_yomugiti_image_1.jpg', rating: 4.8 },
        { id: 'user-artisan-2', userId: 'user-artisan-2', name: 'Jean-Claude Bizimana', craft: 'Maroquinerie', province: 'Bujumbura Mairie', bio: 'Artisan du cuir passionné, je confectionne des sacs, ceintures et sandales de haute qualité. Chaque pièce est faite à la main avec une attention particulière aux détails et à la durabilité.', profileImageId: '/artisant_yomugiti_image_2.jpg', rating: 4.9 },
        { id: 'user-artisan-3', userId: 'user-artisan-3', name: 'Marie Goretti Uwizeye', craft: 'Poterie', province: 'Ngozi', bio: 'Mes créations en poterie allient fonctionnalité et art. Je puise mon inspiration dans les paysages verdoyants du Burundi pour créer des pièces uniques et authentiques.', profileImageId: '/ibirato_image_1.jpg', rating: 4.7 },
        { id: 'user-artisan-4', userId: 'user-artisan-4', name: 'Eric Ndayishimiye', craft: 'Sculpture sur bois', province: 'Muramvya', bio: 'Je transforme le bois local en œuvres d\'art. Mes sculptures représentent des scènes de la vie quotidienne et la riche culture de notre pays.', profileImageId: '/ibirato_image_2.jpg', rating: 4.8 },
        { id: 'user-artisan-5', userId: 'user-artisan-5', name: 'Fabiola Akimana', craft: 'Bijouterie', province: 'Bujumbura Mairie', bio: 'Je crée des bijoux uniques inspirés par les motifs et les perles du Burundi, alliant tradition et modernité.', profileImageId: '/ibirato_image_3.jpg', rating: 4.9 },
        { id: 'user-artisan-6', userId: 'user-artisan-6', name: 'Patrick Kaneza', craft: 'Ferronnerie d\'Art', province: 'Kayanza', bio: 'Artisan forgeron, je donne vie au métal pour créer du mobilier et des objets décoratifs sur mesure.', profileImageId: '/event_image1_edition3.jpg', rating: 4.6 },
        { id: 'user-artisan-7', userId: 'user-artisan-7', name: 'Esther Nininahazwe', craft: 'Textile & Teinture', province: 'Gitega', bio: 'Je travaille les tissus locaux et les teintures naturelles pour produire des étoffes uniques aux couleurs vibrantes.', profileImageId: '/event_image2_edition3.jpg', rating: 4.8 },
        { id: 'user-artisan-8', userId: 'user-artisan-8', name: 'Samuel Bigirimana', craft: 'Instruments de Musique', province: 'Bujumbura Rural', bio: 'Musicien et luthier, je fabrique des tambours traditionnels, des inangas et d\'autres instruments de la musique burundaise.', profileImageId: '/event_image3_edition3.jpg', rating: 4.9 },
    ],
    trainingCenters: [
        { id: 'user-center-1', userId: 'user-center-1', name: 'Centre de Formation Gira', province: 'Gitega', description: 'Le Centre Gira offre des formations professionnelles de haute qualité en coupe-couture, soudure et menuiserie, visant l\'autonomisation des jeunes.', imageId: '/event_image4_edition3.jpg', rating: 4.5 },
        { id: 'user-center-2', userId: 'user-center-2', name: 'Bujumbura Creative Hub', province: 'Bujumbura Mairie', description: 'Un espace innovant pour les créatifs. Nous proposons des formations en design graphique, web design et marketing digital pour les artisans 2.0.', imageId: '/event_image5_edition3.jpg', rating: 4.9 },
        { id: 'user-center-3', userId: 'user-center-3', name: 'Académie des Métiers de Ngozi', province: 'Ngozi', description: 'Spécialisée dans les métiers de la terre, notre académie forme à la poterie, la céramique et l\'agriculture durable.', imageId: '/ibirato_image_achat.jpg', rating: 4.6 },
        { id: 'user-center-4', userId: 'user-center-4', name: 'Tech & Tradition', province: 'Bujumbura Mairie', description: 'Nous formons les artisans à intégrer les nouvelles technologies (impression 3D, design assisté par ordinateur) à leur savoir-faire traditionnel.', imageId: '/ibirato_image_1.jpg', rating: 4.8 },
    ],
    products: [
        { id: 'prod-001', name: 'Panier en jonc "Umuco"', price: 25000, imageId: '/artisant_yomugiti_image_1.jpg', description: 'Grand panier tressé à la main, idéal pour la décoration ou le marché.', artisanId: 'user-artisan-1' },
        { id: 'prod-002', name: 'Sac en cuir "Kazoza"', price: 75000, imageId: '/artisant_yomugiti_image_2.jpg', description: 'Sac à bandoulière en cuir véritable, design moderne et élégant.', artisanId: 'user-artisan-2' },
        { id: 'prod-003', name: 'Vase en argile "Ihanga"', price: 15000, imageId: '/ibirato_image_1.jpg', description: 'Vase décoratif en poterie, parfait pour une touche naturelle.', artisanId: 'user-artisan-3' },
        { id: 'prod-004', name: 'Sculpture "Umuryango"', price: 120000, imageId: '/ibirato_image_2.jpg', description: 'Représentation stylisée d\'une famille en bois de musave. Pièce unique.', artisanId: 'user-artisan-4' },
        { id: 'prod-005', name: 'Collier en perles "Ishaka"', price: 45000, imageId: '/ibirato_image_3.jpg', description: 'Collier plastron coloré fait de perles de rocailles, style royal.', artisanId: 'user-artisan-5' },
        { id: 'prod-006', name: 'Porte-plante en fer forgé', price: 60000, imageId: '/ibirato_image_achat.jpg', description: 'Structure élégante en métal pour mettre en valeur vos plantes d\'intérieur.', artisanId: 'user-artisan-6' },
        { id: 'prod-007', name: 'Écharpe en coton "Imvura"', price: 40000, imageId: '/event_image1_edition3.jpg', description: 'Teinte à la main avec la technique du "tie and dye" utilisant de l\'indigo naturel.', artisanId: 'user-artisan-7' },
        { id: 'prod-008', name: 'Inanga traditionnelle', price: 150000, imageId: '/event_image2_edition3.jpg', description: 'Instrument à cordes traditionnel, entièrement fait main, jouable et décoratif.', artisanId: 'user-artisan-8' },
        { id: 'prod-009', name: 'Sous-plats en fibres de bananier', price: 18000, imageId: '/event_image3_edition3.jpg', description: 'Ensemble de 6 sous-plats tressés, écologiques et durables.', artisanId: 'user-artisan-1' },
        { id: 'prod-010', name: 'Sandales en cuir "Intago"', price: 35000, imageId: '/event_image4_edition3.jpg', description: 'Sandales robustes et confortables pour homme, faites pour durer.', artisanId: 'user-artisan-2' },
        { id: 'prod-011', name: 'Bol décoratif "Amahugurwa"', price: 22000, imageId: '/event_image5_edition3.jpg', description: 'Bol en argile peint à la main avec des motifs colorés. Non alimentaire.', artisanId: 'user-artisan-3' },
        { id: 'prod-012', name: 'Masque mural en bois', price: 95000, imageId: '/artisant_yomugiti_image_1.jpg', description: 'Masque décoratif mural sculpté dans du bois d\'ébène, représentant un esprit protecteur.', artisanId: 'user-artisan-4' },
    ],
    courses: [
        { id: 'course-001', title: 'Initiation à la Coupe et Couture', duration: '3 mois', description: 'Apprenez les bases de la couture, de la prise de mesure à la confection de vêtements simples.', prerequisites: 'Aucun', imageId: '/event_image1_edition3.jpg', centerId: 'user-center-1' },
        { id: 'course-002', title: 'Perfectionnement en Soudure à l\'Arc', duration: '2 mois', description: 'Approfondissez vos techniques de soudure pour réaliser des structures métalliques complexes.', prerequisites: 'Bases en soudure', imageId: '/event_image2_edition3.jpg', centerId: 'user-center-1' },
        { id: 'course-003', title: 'Web Design pour Artisans (WordPress)', duration: '6 semaines', description: 'Créez un site web portfolio pour présenter et vendre vos créations en ligne.', prerequisites: 'Maîtrise de l\'ordinateur', imageId: '/event_image3_edition3.jpg', centerId: 'user-center-2' },
        { id: 'course-004', title: 'Marketing sur les Réseaux Sociaux', duration: '4 semaines', description: 'Utilisez Instagram et Facebook pour promouvoir votre marque d\'artisan et atteindre de nouveaux clients.', prerequisites: 'Compte Facebook/Instagram', imageId: '/event_image4_edition3.jpg', centerId: 'user-center-2' },
        { id: 'course-005', title: 'Techniques Avancées de Céramique', duration: '4 mois', description: 'Maîtrisez le tour de potier, les techniques d\'émaillage et de cuisson pour créer des pièces professionnelles.', prerequisites: 'Bases en poterie', imageId: '/event_image5_edition3.jpg', centerId: 'user-center-3' },
        { id: 'course-006', title: 'Entrepreneuriat Agricole', duration: '5 mois', description: 'Apprenez à gérer une petite exploitation agricole de manière rentable et durable.', prerequisites: 'Aucun', imageId: '/ibirato_image_1.jpg', centerId: 'user-center-3' },
        { id: 'course-007', title: 'Design et Impression 3D', duration: '3 mois', description: 'Apprenez à modéliser en 3D et à utiliser une imprimante 3D pour créer des prototypes et des objets uniques.', prerequisites: 'Maîtrise de l\'ordinateur', imageId: '/ibirato_image_2.jpg', centerId: 'user-center-4' },
        { id: 'course-008', title: 'Codage pour le Web (HTML/CSS/JS)', duration: '6 mois', description: 'Devenez développeur web junior en apprenant les fondamentaux du développement front-end.', prerequisites: 'Aucun', imageId: '/ibirato_image_3.jpg', centerId: 'user-center-4' },
    ],
    mentors: [
        { id: 'user-mentor-1', userId: 'user-mentor-1', name: 'Charlotte Niyongere', expertise: 'Business Development & Export', province: 'Bujumbura Mairie', bio: 'Avec plus de 15 ans d\'expérience dans le commerce international, j\'aide les artisans à structurer leur activité, à fixer leurs prix et à trouver des débouchés à l\'étranger.', profileImageId: '/ibirato_image_achat.jpg', rating: 5.0 },
        { id: 'user-mentor-2', userId: 'user-mentor-2', name: 'Olivier Munezero', expertise: 'Techniques de Production & Qualité', province: 'Gitega', bio: 'Ingénieur de formation et passionné d\'artisanat, j\'accompagne les artisans dans l\'amélioration de leurs processus de production, le contrôle qualité et l\'innovation technique.', profileImageId: '/artisant_yomugiti_image_1.jpg', rating: 4.9 }
    ],
    orders: [
        { id: 'order-001', artisanId: 'user-artisan-1', artisanName: 'Aline Niyonsaba', productId: 'prod-001', productName: 'Panier en jonc "Umuco"', customerId: 'user-student-1', customerName: 'Eliane Nshimirimana', orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending' },
        { id: 'order-002', artisanId: 'user-artisan-2', artisanName: 'Jean-Claude Bizimana', productId: 'prod-002', productName: 'Sac en cuir "Kazoza"', customerId: 'user-admin-1', customerName: 'Admin Umwuga', orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'shipped' },
        { id: 'order-003', artisanId: 'user-artisan-1', artisanName: 'Aline Niyonsaba', productId: 'prod-005', productName: 'Sous-plats en fibres de bananier', customerId: 'user-student-2', customerName: 'Kevin Mugisha', orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending' },
        { id: 'order-004', artisanId: 'user-artisan-4', artisanName: 'Eric Ndayishimiye', productId: 'prod-004', productName: 'Sculpture "Umuryango"', customerId: 'user-admin-1', customerName: 'Admin Umwuga', orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'delivered' }
    ]
};
