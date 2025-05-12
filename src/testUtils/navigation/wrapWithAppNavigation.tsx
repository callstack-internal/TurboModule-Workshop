import React from 'react';

import {
  InitialState,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import DrawerNavigator from '../../navigation/navigators/DrawerNavigator.tsx';

type WrapWithAppNavigationProps = {
  initialState?: InitialState;
  navigationRef?: React.RefObject<NavigationContainerRef<any>>;
};

/**
 * Wraps the full app navigator (`DrawerNavigator`) in a `NavigationContainer` for testing.
 *
 * This is the preferred utility when writing tests for **real screen components or components that navigate** that are part of
 * the actual app navigation tree. It gives you a full, realistic navigation environment without mocks,
 * including nested navigators, screen options, transitions, etc.
 *
 * Unlike `TestNavigator`, this uses your actual app's navigator configuration, making it ideal for testing:
 * - Navigation behavior (e.g., `navigate`, `goBack`, deep linking)
 * - Screen lifecycle hooks (e.g., `useFocusEffect`, `useNavigation`)
 * - Integration-level rendering of screen flows
 *
 * ⚠️ Note: This should be used when testing **screen components**.
 * If you're only testing a non-screen component (e.g. custom hook, modal, header)
 * that requires navigation context, consider using `TestNavigator` or `createTestNavigator` instead for a minimal setup.
 *
 */
export const wrapWithAppNavigation = ({
  initialState,
  navigationRef,
}: WrapWithAppNavigationProps) => {
  return (
    <NavigationContainer initialState={initialState} ref={navigationRef}>
      <DrawerNavigator />
    </NavigationContainer>
  );
};
