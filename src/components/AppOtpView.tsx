import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {KeyboardTypeOptions, StyleSheet, TextInput, View} from 'react-native';
import {FontSize, Fonts} from '../assets/fonts';
import {useTheme} from '../theme/ThemeProvider';
import AppText from './AppText';
import {Theme} from '../types';

interface AppOtpViewProps {
  defaultValue?: string;
  inputCount?: number;
  inputCellLength?: number;
  containerStyle?: any;
  textInputStyle?: any;
  handleTextChange?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions | undefined;
}

const AppOtpView: FC<AppOtpViewProps> = ({
  defaultValue = '',
  inputCount = 4,
  inputCellLength = 1,
  containerStyle = {},
  textInputStyle = {},
  handleTextChange = () => {},
  ...textInputProps
}) => {
  const {AppColors, isDarkMode} = useTheme();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);
  const [focusedInput, setFocusedInput] = useState<number>(0);
  const [otpText, setOtpText] = useState<string[]>(
    Array.from({length: inputCount}, () => ''),
  );
  const inputs = useRef<TextInput[]>([]);

  const basicValidation = (text: string) => {
    const validText = /^[0-9]+$/;
    return text.match(validText);
  };

  useEffect(() => {
    // Handle text change here and join the otpText array
    handleTextChange(otpText.join(''));
  }, [otpText, handleTextChange]);

  const onTextChange = (text: string, i: number) => {
    if (text && !basicValidation(text)) {
      return;
    }

    // Update the state with the new value
    setOtpText(prevOtpText => {
      const newOtpText = [...prevOtpText];
      newOtpText[i] = text;
      console.log('##----->> OTP', newOtpText);
      return newOtpText;
    });

    // Focus on the next input if available
    if (text.length === inputCellLength && i < inputCount - 1) {
      inputs.current[i + 1]?.focus();
    }
  };

  const onInputFocus = (i: number) => {
    setFocusedInput(i);
  };

  const onKeyPress = (e: any, i: number) => {
    const val = otpText[i] || '';
    if (e.nativeEvent.key === 'Backspace' && i !== 0 && !val.length) {
      inputs.current[i - 1]?.focus();
    }
  };

  return (
    <View>
      <AppText
        fontFamily={Fonts.REGULAR}
        label={`A code has been sent to your mobile / email.`}
      />
      <View style={[styles.container, containerStyle]}>
        {Array.from({length: inputCount}, (_, i) => (
          <TextInput
            // placeholder="-"
            placeholderTextColor={AppColors.secondaryTransparent}
            key={i}
            ref={ref => (inputs.current[i] = ref as TextInput)}
            autoCorrect={false}
            keyboardType={'numeric'}
            autoFocus={i === 0}
            value={otpText[i]}
            style={[
              styles.textInput,
              textInputStyle,
              otpText[i] || focusedInput === i ? {borderWidth: 1} : null,
            ]}
            maxLength={inputCellLength}
            onFocus={() => onInputFocus(i)}
            onChangeText={text => onTextChange(text, i)}
            multiline={false}
            onKeyPress={e => onKeyPress(e, i)}
            {...textInputProps}
          />
        ))}
      </View>
    </View>
  );
};

const createStyles = (AppColors: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingTop: 20,
    },

    textInput: {
      width: 40,
      height: 40,
      marginRight: 10,
      includeFontPadding: false,
      color: AppColors.primary,
      backgroundColor: AppColors.placeholder,
      borderColor: AppColors.primary,
      textAlign: 'center',
      fontFamily: Fonts.BOLD,
      fontSize: FontSize._18,
    },
  });
};

export default AppOtpView;
