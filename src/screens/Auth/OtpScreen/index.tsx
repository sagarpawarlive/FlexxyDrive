import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import AppButton from '../../../components/AppButton';
import AppHeader from '../../../components/AppHeader';
import AppOtpView from '../../../components/AppOtpView';
import MainContainer from '../../../components/MainContainer';
import {AppContainer, AppMargin} from '../../../constants/commonStyle';
import {NavigationKeys} from '../../../constants/navigationKeys';
import {useTheme} from '../../../theme/ThemeProvider';
import {Theme} from '../../../types';

const OtpScreen = (props: any) => {
  const dispatch = useDispatch();
  const {isDarkMode, toggleTheme, AppColors} = useTheme();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);

  const onBackPress = () => {
    props.navigation.goBack();
  };

  return (
    <MainContainer>
      <View style={AppContainer}>
        <View style={{flex: 1}}>
          <AppHeader onBack={onBackPress} buttonTitle="Back" />

          <View style={{marginTop: 20}}>
            <Text>Enter Verification Code</Text>
          </View>
          <AppOtpView defaultValue="4" />
          <View style={{marginTop: 20}}>
            <Text>Don't have a Code?</Text>
            <Text>Resend</Text>
          </View>
        </View>

        <AppButton
          buttonLabel={'Continue'}
          onClick={() =>
            props.navigation.navigate(NavigationKeys.StarterScreen)
          }
        />
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

export default OtpScreen;
