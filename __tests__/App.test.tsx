/**
 * @format
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

test('renders correctly', async () => {
  // App already includes SafeAreaProvider, AdoptionProvider, and NavigationContainer
  render(<App />);
});
