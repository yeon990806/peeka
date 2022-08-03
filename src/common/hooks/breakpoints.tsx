import { useMediaQuery } from 'react-responsive';

const IsMobile = () => useMediaQuery({
  query: '(max-width: 1023px)',
})

const IsDesktop = () => useMediaQuery({
  query: '(min-width: 1024px)',
})


const Mobile = ({ children }) => {
  return <>{ IsMobile() && children }</>;
};

const Desktop = ({ children }) => {
  return <>{ IsDesktop() && children }</>;
}

export { IsMobile, IsDesktop, Mobile, Desktop }