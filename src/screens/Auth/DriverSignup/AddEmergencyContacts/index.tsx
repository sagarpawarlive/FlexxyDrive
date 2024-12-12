import React, { useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
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

const AddEmergencyContacts = (props: any) => {
	const dispatch = useDispatch();
	const { isDarkMode, toggleTheme, AppColors } = useTheme();
	const styles = useMemo(() => createStyles(AppColors), [AppColors]);
	const [contactList, setContactList] = useState([
		{
			name: 'John Doe',
			phoneNumber: '123-456-7890',
			email: 'KtZQG@example.com',
		},
	]);
	const [newContact, setNewContact] = useState(false);

	const onBackPress = () => {
		props.navigation.goBack();
	};

	const toggleContactAdd = () => {
		setNewContact(!newContact);
	};

	const handleSaveContact = async newContact => {
		setContactList(prevContacts => [...prevContacts, newContact]);
		const params = { emergencyContacts: contactList }; //check this
		let res = await apiPost(ENDPOINT.SET_DRIVER_INFO, params);
		// props.navigation.navigate(NavigationKeys.OtpScreen);
		// dispatch(setIsLogin(true));
	};

	const renderContactItem = ({ item }) => (
		<View style={{ marginTop: AppMargin._20 }}>
			<View
				style={{
					...borderRadius10,
					flexDirection: 'row',
					padding: 20,
					borderWidth: 1,
					borderColor: AppColors.white,
					alignItems: 'center',
				}}>
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
				<AppHeader
					buttonTitle={'Add Emergency Contacts'}
					tintColor={AppColors.backButton}
					top={AppMargin._30}
					onBack={onBackPress}
				/>

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
					onClick={toggleContactAdd} // Trigger Formik form submission
				/>

				<AddNewContact
					isVisible={newContact}
					title={'Your trusted contact'}
					onSaveContact={handleSaveContact}
					onClose={toggleContactAdd}
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
		innerMainContainer: {
			flex: 1,
			backgroundColor: AppColors.background,
			paddingHorizontal: 20,
		},
	});
};

export default AddEmergencyContacts;
