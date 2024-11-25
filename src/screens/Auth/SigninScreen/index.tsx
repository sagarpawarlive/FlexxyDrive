import React, {useMemo, useState} from 'react';
import {Keyboard, Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {FontSize, Fonts} from '../../../assets/fonts';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';
import MainContainer from '../../../components/MainContainer';
import {AppContainer, AppMargin} from '../../../constants/commonStyle';
import {NavigationKeys} from '../../../constants/navigationKeys';
import {_showToast} from '../../../services/UIs/ToastConfig';
import {useTheme} from '../../../theme/ThemeProvider';
import {Theme} from '../../../types';
import {
  isValidEmail,
  isValidPasswordCharacter,
  isValidPasswordLength,
  isValidPasswordSpecial,
} from '../../../utils/validators';

const SigninScreen = (props: any) => {
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
    const pass = password ? password.trim() : '';

    switch (true) {
      case !email:
        _showToast('Enter email address');
        break;
      case !isValidEmail(email):
        _showToast('Enter valid Email address');
        break;
      case !pass:
        _showToast('Enter password');
        break;
      case !isValidPasswordLength(pass):
        _showToast('The password must be at least 8 characters long');
        break;
      case !isValidPasswordCharacter(pass):
        _showToast('The password must contain one uppercase, one lowercase');
        break;
      case !isValidPasswordSpecial(pass):
        _showToast('The password must contain one special character');
        break;
      default:
        props.navigation.navigate(NavigationKeys.StarterScreen);
        _showToast('Login Success', 'success');
        // dispatch(setIsLogin(true));
        clearLoginData();
        break;
    }
  };

  return (
    <MainContainer>
      <View style={AppContainer}>
        <View>
          <AppText
            fontFamily={Fonts.BOLD}
            fontSize={FontSize._32}
            label={`Logo`}
          />
          <AppText
            fontFamily={Fonts.BOLD}
            fontSize={FontSize._32}
            label={`Login`}
          />
        </View>

        <View style={{flex: 1}}>
          <AppTextInput
            placeholder={'Email Address'}
            value={emailAddress}
            onChangeText={(text: React.SetStateAction<string>) =>
              setEmailAddress(text)
            }
          />

          <AppTextInput
            placeholder={'Password'}
            value={password}
            onChangeText={(text: React.SetStateAction<string>) =>
              setPassword(text)
            }
            secureTextEntry={!showPassword}
          />

          <Pressable
            style={{marginTop: 10, alignItems: 'flex-end'}}
            onPress={() =>
              props.navigation.navigate(NavigationKeys.ForgotPasswordScreen)
            }>
            <Text style={{color: AppColors.primary}}>Forgot Password?</Text>
          </Pressable>
        </View>

        <AppButton buttonLabel={'Login'} onClick={validateCredentials} />

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

export default SigninScreen;
