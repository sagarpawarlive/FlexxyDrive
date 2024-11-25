import React, {useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {FontSize, Fonts} from '../../../assets/fonts';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';
import MainContainer from '../../../components/MainContainer';
import {AppContainer, AppMargin} from '../../../constants/commonStyle';
import {NavigationKeys} from '../../../constants/navigationKeys';
import {useTheme} from '../../../theme/ThemeProvider';
import {Theme} from '../../../types';

const SignupScreen = (props: any) => {
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
    props.navigation.navigate(NavigationKeys.OtpScreen);
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
            label={`Signup`}
          />
        </View>

        <View style={{flex: 1}}>
          <AppTextInput
            placeholder={'First Name'}
            value={emailAddress}
            onChangeText={(text: React.SetStateAction<string>) =>
              setEmailAddress(text)
            }
          />

          <AppTextInput
            placeholder={'Last name'}
            value={emailAddress}
            onChangeText={(text: React.SetStateAction<string>) =>
              setEmailAddress(text)
            }
          />

          <AppTextInput
            placeholder={'Phone Number'}
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

          <AppTextInput
            placeholder={'Confirm Password'}
            value={password}
            onChangeText={(text: React.SetStateAction<string>) =>
              setPassword(text)
            }
            secureTextEntry={!showPassword}
          />
        </View>

        <AppButton buttonLabel={'Confirm'} onClick={validateCredentials} />

        <View style={{marginVertical: 20, flexDirection: 'row'}}>
          <Text>Dont have an account?</Text>
          <Pressable
            style={{marginLeft: 5}}
            onPress={() =>
              props.navigation.navigate(NavigationKeys.SigninScreen)
            }>
            <Text style={{color: AppColors.primary}}>Sign In</Text>
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

export default SignupScreen;
