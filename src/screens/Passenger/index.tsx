import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Fonts } from '../../assets/fonts';
import AppLoader from '../../components/AppLoader';
import AppText from '../../components/AppText';
import MainContainer from '../../components/MainContainer';
import { AppMargin, AppPadding } from '../../constants/commonStyle';
import { t } from '../../i18n';
import { AppDispatch } from '../../store';
import { useTheme } from '../../theme/ThemeProvider';
import { Theme } from '../../types';

declare function alert(message: string): void;

interface PassengerScreenProps {
    navigation: any
}

const PassengerScreen = (props: PassengerScreenProps) => {

    const { AppColors, isDarkMode } = useTheme();
    const styles = useMemo(() => createStyles(AppColors), [AppColors]);

    const dispatch: AppDispatch = useDispatch();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    return (
        <MainContainer>
            {isLoading && <AppLoader isLoading={isLoading} />}
            <View style={{ marginHorizontal: 20, flex: 1 }}>
                <AppText textColor={AppColors.primary} fontFamily={Fonts.BOLD} title={`${t('title')} ${'Driver'}`} />

                <View style={{ flex: 1 }}>
                    <Text>Driver</Text>
                </View>

            </View>
        </MainContainer>
    );
};

const createStyles = (AppColors: Theme) => {
    return StyleSheet.create({
        renderContainer: {
            padding: 20,
            borderWidth: 1,
            borderColor: AppColors.primaryTransparent
        },
        flatListContainer: {
            paddingBottom: AppMargin._75,
            paddingTop: AppPadding._20,
        },
    });
};

export default PassengerScreen;