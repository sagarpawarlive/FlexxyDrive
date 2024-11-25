import React, {useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import MainContainer from '../../../components/MainContainer';
import {AppContainer, AppMargin} from '../../../constants/commonStyle';
import {NavigationKeys} from '../../../constants/navigationKeys';
import {useTheme} from '../../../theme/ThemeProvider';
import {Theme} from '../../../types';

const IntroScreen = (props: any) => {
  const dispatch = useDispatch();
  const {isDarkMode, toggleTheme, AppColors} = useTheme();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);

  return (
    <MainContainer>
      <View style={AppContainer}>
        <View style={{flex: 1}}>
          <View>
            <AppText title="Logo" />
          </View>

          <View>
            <AppText title="Image" />
          </View>

          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <AppText title="Welcome to the ride with Flexxy" />
          </View>

          <AppButton
            position={'end'}
            buttonLabel={'Continue'}
            onClick={() =>
              props.navigation.navigate(NavigationKeys.LocationPermission)
            }
          />

          <Pressable onPress={() => alert('driver app')} style={{}}>
            <AppText title="Or driving App" />
          </Pressable>
        </View>
      </View>
    </MainContainer>
  );
};

const createStyles = (AppColors: Theme) => {
  return StyleSheet.create({
    orContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: AppMargin._20,
    },
  });
};

export default IntroScreen;
