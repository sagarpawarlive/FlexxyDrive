import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import AppButton from '../../../components/AppButton';
import MainContainer from '../../../components/MainContainer';
import {AppContainer, AppMargin} from '../../../constants/commonStyle';
import {NavigationKeys} from '../../../constants/navigationKeys';
import {useTheme} from '../../../theme/ThemeProvider';
import {Theme} from '../../../types';

const LocationPermission = (props: any) => {
  const dispatch = useDispatch();
  const {isDarkMode, toggleTheme, AppColors} = useTheme();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);

  return (
    <MainContainer>
      <View style={AppContainer}>
        <View style={{flex: 1}}>
          <View>
            <Text>Image</Text>
          </View>

          <View>
            <Text>Dont worry your data is Private</Text>
          </View>
        </View>

        <AppButton
          buttonLabel={'Allow Location'}
          onClick={() => props.navigation.navigate(NavigationKeys.SigninScreen)}
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

export default LocationPermission;
