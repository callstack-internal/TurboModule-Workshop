import { AdoptionProvider } from '../../context/AdoptionContext.tsx';

export const wrapWithAdoptionContext = (children: React.ReactNode) => {
  return <AdoptionProvider>{children}</AdoptionProvider>;
};
