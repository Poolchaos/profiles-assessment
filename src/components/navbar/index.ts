import { CustomElementConfig } from '../../scripts/custom-element';

export const customElements: CustomElementConfig[] = [
  {
    tagName: 'navbar',
    template: '/components/navbar/navbar.html',
    viewModel: '/components/navbar/navbar.ts',
  },
];
