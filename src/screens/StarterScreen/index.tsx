import React, { useEffect, useMemo } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import { useDispatch } from 'react-redux';
import AppButton from '../../components/AppButton';
import AppText from '../../components/AppText';
import MainContainer from '../../components/MainContainer';
import { AppMargin, AppPadding } from '../../constants/commonStyle';
import { AppDispatch } from '../../store';
import { useTheme } from '../../theme/ThemeProvider';
import { Theme } from '../../types';

declare function alert(message: string): void;

interface StarterScreenProps {
    navigation: any;
}

const StarterScreen = (props: StarterScreenProps) => {
    const { AppColors, isDarkMode } = useTheme();
    const styles = useMemo(() => createStyles(AppColors), [AppColors]);

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => { });

        return () => {
            unsubscribe();
        };
    }, [dispatch, props.navigation]);

    return (
        <MainContainer>
            <View style={{ marginHorizontal: 20, flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <AppText title="Logo" />
                    <AppText title="Welcome to flexxy" />
                </View>
                <View style={{ flex: 1 }}>
                    <AppButton
                        textColor={AppColors.primary}
                        buttonLabel={'Book A Ride'}
                    />
                    <AppButton
                        top={40}
                        textColor={AppColors.primary}
                        buttonLabel={'Offer A Ride'}
                    />
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
            borderColor: AppColors.primaryTransparent,
        },
        flatListContainer: {
            paddingBottom: AppMargin._75,
            paddingTop: AppPadding._20,
        },
    });
};

export default StarterScreen;
