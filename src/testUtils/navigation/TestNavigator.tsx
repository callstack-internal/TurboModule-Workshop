import React, { useEffect } from 'react';

import {
  createNavigatorFactory,
  useNavigationBuilder,
  StackRouter,
  TabRouter,
  DrawerRouter,
  DefaultRouterOptions,
  StackRouterOptions,
  TabRouterOptions,
  DrawerRouterOptions,
  NavigationHelpers,
  ParamListBase,
  RouterFactory,
  Router,
  NavigationState,
  NavigationAction,
  NavigationContainer,
} from '@react-navigation/native';
import type {
  StackNavigationState,
  TabNavigationState,
  DrawerNavigationState,
} from '@react-navigation/native';
import type {
  StackActionHelpers,
  TabActionHelpers,
  DrawerActionHelpers,
} from '@react-navigation/native';
import { Text } from 'react-native';

type TestScreenOptions = Record<string, unknown>;

type NavigatorType = 'stack' | 'tabs' | 'drawer';

interface TestNavigatorImplProps extends DefaultRouterOptions {
  type: NavigatorType;
  screenOptions?: TestScreenOptions;
  initialRouteName?: string;
  children: React.ReactNode;
}

type AnyNavigationState =
  | StackNavigationState<ParamListBase>
  | TabNavigationState<ParamListBase>
  | DrawerNavigationState<ParamListBase>;

type AnyRouterOptions = StackRouterOptions | TabRouterOptions | DrawerRouterOptions;

type AnyActionHelpers =
  | StackActionHelpers<ParamListBase>
  | TabActionHelpers<ParamListBase>
  | DrawerActionHelpers<ParamListBase>;

type ExtractedAction = Exclude<
  Parameters<Router<NavigationState, NavigationAction>['getStateForAction']>[0],
  undefined
>;

/**
 * Custom navigator component used for testing React Navigation screens.
 * Supports `stack`, `tabs`, and `drawer` types.
 * Renders all screens at once and injects a `focused` prop based on navigation state.
 *
 * Useful in tests to simulate navigation behavior with a lightweight navigator.
 */
const TestNavigatorImpl = ({ type, ...rest }: TestNavigatorImplProps): React.ReactElement => {
  const router = (
    type === 'drawer' ? DrawerRouter : type === 'stack' ? StackRouter : TabRouter
  ) as RouterFactory<AnyNavigationState, ExtractedAction, AnyRouterOptions>;

  const {
    state,
    descriptors,
    NavigationContent: Content,
  } = useNavigationBuilder<
    AnyNavigationState,
    AnyRouterOptions,
    AnyActionHelpers,
    TestScreenOptions,
    NavigationHelpers<ParamListBase>
  >(router, rest);

  return <Content>{state.routes.map((route) => descriptors[route.key]?.render())}</Content>;
};

/**
 * Creates a navigator factory for the TestNavigator.
 * This wraps the custom `TestNavigator` using `createNavigatorFactory`,
 * enabling use of `Navigator` and `Screen` components just like built-in navigators.
 *
 * Use this when integrating `TestNavigator` into `NavigationContainer`.
 */
const createTestNavigatorFactory = createNavigatorFactory(TestNavigatorImpl);

type LayoutProps = {
  name: string;
  focused: boolean;
  navigation: NavigationHelpers<ParamListBase>;
  children: React.ReactNode;
};

const CustomLayout = ({ name, focused, navigation, children }: LayoutProps): React.ReactElement => {
  useEffect(() => {
    const state = navigation.getState();
    const currentRoute = state.routes[state.index];

    if (focused && currentRoute?.name !== name) {
      navigation.navigate(name);
    } else if (!focused && currentRoute?.name !== 'Dummy') {
      navigation.navigate('Dummy');
    }
  }, [focused, name, navigation]);

  return <>{children}</>;
};

const TestLayout = ({ name, focused, ...props }: LayoutProps): React.ReactElement => {
  return <CustomLayout {...props} name={name} focused={focused} />;
};

export const TestNavigator = ({
  children,
  type = 'stack',
  name = 'TestScreen',
  focused = true,
  screenParams,
  dummyName = 'Dummy',
}: {
  children: React.ReactNode;
  type?: NavigatorType;
  name?: string;
  focused?: boolean;
  screenParams?: object;
  dummyName?: string;
}) => {
  const Test = createTestNavigatorFactory();

  return (
    <NavigationContainer>
      <Test.Navigator
        key={type}
        type={type}
        initialRouteName={focused ? name : dummyName}
        layout={
          /* eslint-disable-next-line react/no-unstable-nested-components */
          (props: Omit<LayoutProps, 'name' | 'focused'>) => (
            <TestLayout {...props} name={name} focused={focused} />
          )
        }
      >
        <Test.Screen name={name} getId={() => name} initialParams={screenParams}>
          {() => children}
        </Test.Screen>
        <Test.Screen name={dummyName} getId={() => dummyName}>
          {() => <Text testID="dummy-screen">Dummy</Text>}
        </Test.Screen>
      </Test.Navigator>
    </NavigationContainer>
  );
};
