import type { ReactNode } from 'react';

import { TutorialDailyIllustration } from '../components/TutorialDailyIllustration';
import { TutorialLinesIllustration } from '../components/TutorialLinesIllustration';
import { TutorialPlaceIllustration } from '../components/TutorialPlaceIllustration';

export interface TutorialPageContent {
  illustration: ReactNode;
  title: string;
  body: string;
  buttonLabel: string;
}

export const TUTORIAL_PAGES: readonly TutorialPageContent[] = [
  {
    illustration: <TutorialPlaceIllustration />,
    title: 'Glisse une pièce sur la grille',
    body: "Choisis l'une des trois pièces et pose-la où tu veux. Les pièces ne tournent pas.",
    buttonLabel: 'Suivant',
  },
  {
    illustration: <TutorialLinesIllustration />,
    title: 'Complète des lignes',
    body: "Une ligne ou une colonne pleine disparaît. Plusieurs d'un coup rapportent beaucoup plus de points.",
    buttonLabel: 'Suivant',
  },
  {
    illustration: <TutorialDailyIllustration />,
    title: 'Un défi par jour',
    body: "Tu n'as qu'une tentative. La partie s'arrête quand plus aucune pièce ne rentre.",
    buttonLabel: "C'est parti",
  },
];
