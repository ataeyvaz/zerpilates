import { useWindowDimensions } from 'react-native';

export function useOrientation() {
  const { width, height } = useWindowDimensions();
  return {
    isLandscape: width > height,
    isTV: width > height && width >= 600,
    width,
    height,
  };
}
