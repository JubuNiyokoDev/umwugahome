import type { Artisan, TrainingCenter, User } from './types';

export const artisans: Artisan[] = [
  {
    id: '1',
    name: 'Aline Niyonsaba',
    craft: 'Vannerie',
    province: 'Gitega',
    bio: 'Spécialiste de la vannerie traditionnelle burundaise, Aline crée des paniers et des objets décoratifs uniques en utilisant des techniques transmises de génération en génération.',
    profileImageId: 'artisan-1',
    rating: 4.8,
    products: [
      { id: 'p1', name: 'Panier en jonc', price: 25000, imageId: 'product-1', description: 'Panier tressé à la main, idéal pour le marché ou la décoration.' },
      { id: 'p2', name: 'Sous-plat décoratif', price: 15000, imageId: 'product-1', description: 'Un magnifique sous-plat pour protéger et décorer votre table.' },
    ],
  },
  {
    id: '2',
    name: 'Jean-Claude Bizimana',
    craft: 'Poterie',
    province: 'Ngozi',
    bio: 'Artisan potier passionné, Jean-Claude façonne l\'argile locale pour créer des poteries utilitaires et artistiques, alliant formes modernes et motifs traditionnels.',
    profileImageId: 'artisan-2',
    rating: 4.9,
    products: [
      { id: 'p3', name: 'Vase en terre cuite', price: 35000, imageId: 'product-2', description: 'Vase élégant pour sublimer vos compositions florales.' },
      { id: 'p4', name: 'Service à café', price: 75000, imageId: 'product-2', description: 'Ensemble de tasses et soucoupes fait main.' },
    ],
  },
  {
    id: '3',
    name: 'Marie-Claire Ineza',
    craft: 'Couture',
    province: 'Bujumbura Mairie',
    bio: 'Styliste et couturière, Marie-Claire confectionne des vêtements modernes en utilisant des tissus traditionnels comme l\'imvutano, créant un pont entre héritage et mode contemporaine.',
    profileImageId: 'artisan-3',
    rating: 4.7,
    products: [
      { id: 'p5', name: 'Robe en pagne', price: 60000, imageId: 'product-3', description: 'Robe colorée et élégante pour toutes les occasions.' },
    ],
  },
  {
    id: '4',
    name: 'David Nkurunziza',
    craft: 'Sculpture sur bois',
    province: 'Muramvya',
    bio: 'Sculpteur sur bois, David donne vie à des figurines et des masques inspirés de la culture et de la nature burundaises. Chaque pièce est une œuvre d\'art unique.',
    profileImageId: 'artisan-4',
    rating: 4.8,
    products: [
      { id: 'p6', name: 'Figurine d\'oiseau', price: 45000, imageId: 'product-4', description: 'Sculpture fine représentant un oiseau endémique du Burundi.' },
    ],
  },
];

export const trainingCenters: TrainingCenter[] = [
  {
    id: 'c1',
    name: 'Centre de Formation Professionnelle de Gitega',
    province: 'Gitega',
    description: 'Le CFP de Gitega offre des formations de pointe en menuiserie, mécanique et informatique pour préparer les jeunes aux métiers de demain.',
    imageId: 'training-center-1',
    rating: 4.5,
    courses: [
      { id: 'cr1', title: 'Menuiserie Moderne', duration: '6 mois', imageId: 'course-1', description: 'Apprenez les techniques de fabrication de meubles modernes.', prerequisites: 'Aucun' },
      { id: 'cr2', title: 'Maintenance Informatique', duration: '3 mois', imageId: 'course-1', description: 'Devenez technicien en maintenance hardware et software.', prerequisites: 'Niveau secondaire' },
    ],
  },
  {
    id: 'c2',
    name: 'École des Arts et Métiers de Bujumbura',
    province: 'Bujumbura Mairie',
    description: 'Notre école est dédiée à la préservation et à l\'enseignement des arts traditionnels, de la couture à la poterie, en passant par la danse.',
    imageId: 'training-center-2',
    rating: 4.7,
    courses: [
      { id: 'cr3', title: 'Coupe et Couture', duration: '1 an', imageId: 'course-2', description: 'Maîtrisez l\'art de la confection de vêtements sur mesure.', prerequisites: 'Aucun' },
      { id: 'cr4', title: 'Poterie et Céramique', duration: '9 mois', imageId: 'course-2', description: 'Apprenez à travailler l\'argile pour créer des objets uniques.', prerequisites: 'Aucun' },
    ],
  },
];

export const users: User[] = [
  {
    id: 'u1',
    name: 'Chris Clement Igiraneza',
    email: 'admin@umwugahome.bi',
    role: 'admin',
    profileImageId: 'artisan-1',
    interests: [],
  },
  {
    id: 'u2',
    name: 'Eliane Nshimirimana',
    email: 'eliane@student.bi',
    role: 'student',
    profileImageId: 'student-profile-1',
    interests: ['Couture', 'Design de mode'],
  }
];
