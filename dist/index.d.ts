export default function MenuAim(options: {
  menuSelector: string;
  classItem: string;
  classItemActive: string;
  classPopup: string;
  classPopupActive: string;
  delay?: number;
  submenuDirection?: 'top' | 'left' | 'bottom' | 'right';
  tolerance?: number;
}): void;
