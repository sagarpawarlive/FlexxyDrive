import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Fonts, FontSize } from '../../../../assets/fonts';
import { Icons } from '../../../../assets/Icons';
import AppButton from '../../../../components/AppButton';
import AppHeader from '../../../../components/AppHeader';
import AppText from '../../../../components/AppText';
import MainContainer from '../../../../components/MainContainer';
import { AppMargin, borderRadius10 } from '../../../../constants/commonStyle';
import AddNewContact from '../../../../subviews/AddNewContact';
import { useTheme } from '../../../../theme/ThemeProvider';
import { Theme } from '../../../../types';
import { apiPost } from '../../../../services/API/apiServices';
import { ENDPOINT } from '../../../../services/API/endpoints';
import { updateUserState } from '../../../../store/reducers/userdataSlice';
import { _showToast } from '../../../../services/UIs/ToastConfig';
import { t } from '../../../../i18n';

const AddEmergencyContacts = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();

	const userData = useSelector((state: any) => state.userDataSlice.userData?.data);
	console.log('[ / userData ] ------->', userData);
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);
	const [contactList, setContactList] = useState(userData?.user?.driverInfo?.emergencyContacts ?? []);
	const [newContact, setNewContact] = useState(false);

	const onBackPress = () => {
		props.navigation.goBack();
	};

	const toggleContactAdd = () => {
		setNewContact(!newContact);
	};

	const handleSaveContact = async newContact => {
		setContactList(prevContacts => {
			const updatedList = [...prevContacts, newContact];
			const params = { emergencyContacts: updatedList };
			apiPost(ENDPOINT.SET_DRIVER_INFO, params)
				.then(res => {
					// Handle success or failure
					if (res?.success) {
						dispatch(
							updateUserState({
								driverInfo: { ...res?.data },
							}),
						);
						_showToast('Contact saved successfully!', 'success');
						console.log('Contact saved successfully!');
					} else {
						console.error('Failed to save contact');
					}
				})
				.catch(error => {
					console.error('Error occurred:', error);
				});
			return updatedList; // Return the updated contact list
		});
	};

	const renderContactItem = ({ item }) => (
		<View style={{ marginTop: AppMargin._20 }}>
			<View style={styles.renderContact}>
				<Image source={Icons.icnUserPlaceholder} />
				<View style={{ marginLeft: AppMargin._20 }}>
					<AppText fontFamily={Fonts.MEDIUM} fontSize={FontSize._16} title={item.name} />
					<AppText
						top={AppMargin._5}
						fontFamily={Fonts.REGULAR}
						fontSize={FontSize._12}
						title={item.phoneNumber}
					/>
					<AppText top={AppMargin._5} fontFamily={Fonts.REGULAR} fontSize={FontSize._12} title={item.email} />
				</View>
			</View>
		</View>
	);

	return (
		<MainContainer>
			<View style={styles.innerMainContainer}>
				<AppHeader buttonTitle={t('addEmergencyContact')} top={AppMargin._15} onBack={onBackPress} />

				{/* FlatList to render the contact list */}
				<FlatList
					data={contactList}
					renderItem={renderContactItem}
					keyExtractor={(item, index) => index.toString()}
				/>

				<AppButton
					textColor={AppColors.textDark}
					fontSize={FontSize._16}
					fontFamily={Fonts.MEDIUM}
					position="end"
					buttonLabel={'Add New'}
					onClick={toggleContactAdd} // Trigger Add New Contact form
				/>

				<AddNewContact
					isVisible={newContact}
					title={t('yourTrustedContact')}
					onSaveContact={handleSaveContact}
					onClose={toggleContactAdd}
				/>
			</View>
		</MainContainer>
	);
};

const createStyles = (AppColors: Theme) => {
	return StyleSheet.create({
		innerMainContainer: {
			flex: 1,
			backgroundColor: AppColors.background,
			paddingHorizontal: 20,
			paddingBottom: 16,
		},
		renderContact: {
			flexDirection: 'row',
			padding: 20,
			borderWidth: 1,
			borderColor: AppColors.white,
			alignItems: 'center',
			...borderRadius10,
		},
	});
};

export default AddEmergencyContacts;
