import React, {useMemo, useState} from 'react';
import {Keyboard, Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Fonts} from '../../../assets/fonts';
import AppButton from '../../../components/AppButton';
import AppHeader from '../../../components/AppHeader';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';
import MainContainer from '../../../components/MainContainer';
import {AppContainer, AppMargin} from '../../../constants/commonStyle';
import {NavigationKeys} from '../../../constants/navigationKeys';
import {_showToast} from '../../../services/UIs/ToastConfig';
import {setIsLogin} from '../../../store/reducers/commonData.slice';
import {useTheme} from '../../../theme/ThemeProvider';
import {Theme} from '../../../types';
import {
  isValidEmail,
  isValidPasswordCharacter,
  isValidPasswordLength,
  isValidPasswordSpecial,
} from '../../../utils/validators';

const ForgotPasswordScreen = (props: any) => {
  const dispatch = useDispatch();
  const {isDarkMode, toggleTheme, AppColors} = useTheme();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const clearLoginData = () => {
    setEmailAddress('');
    setPassword('');
  };

  const validateCredentials = () => {
    Keyboard.dismiss();
    const email = emailAddress ? emailAddress.trim() : '';
    switch (true) {
      case !email:
        _showToast('Enter email address');
        break;
      case !isValidEmail(email):
        _showToast('Enter valid Email address');
        break;

      default:
        props.navigation.navigate(NavigationKeys.OtpScreen);
        // _showToast('Reset Success', 'success');
        clearLoginData();
        break;
    }
  };

  const onBackPress = () => {
    props.navigation.goBack();
  };

  return (
    <MainContainer>
      <View style={AppContainer}>
        <View style={{flex: 1}}>
          <AppHeader onBack={onBackPress} buttonTitle="Back" />

          <AppText
            fontFamily={Fonts.REGULAR}
            textColor={AppColors.secondary}
            top={20}
            label={`We just needRegistered Email / Phone number to reset password`}
          />

          <AppTextInput
            placeholder={'Email Id / Phone Number'}
            value={emailAddress}
            onChangeText={(text: React.SetStateAction<string>) =>
              setEmailAddress(text)
            }
          />
        </View>

        <AppButton buttonLabel={'Send'} onClick={validateCredentials} />

        <View style={{marginVertical: 20, flexDirection: 'row'}}>
          <Text>Dont have an account?</Text>
          <Pressable
            style={{marginLeft: 5}}
            onPress={() =>
              props.navigation.navigate(NavigationKeys.SignupScreen)
            }>
            <Text style={{color: AppColors.primary}}>Sign Up</Text>
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

export default ForgotPasswordScreen;
