import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StepItemProps {
	title: string;
	subTitle?: string;

	isActive: boolean;

	activeStepColor?: string;
	inactiveStepColor?: string;

	activeLabelColor?: string;
	inactiveLabelColor?: string;
}

const StepItem: React.FC<StepItemProps> = ({
	title,
	subTitle,

	isActive,

	activeStepColor,
	inactiveStepColor,

	activeLabelColor,
	inactiveLabelColor

}) => {
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			<View style={[styles.stepItem, {
				backgroundColor: isActive
					? activeStepColor
					: inactiveStepColor
			}]} />
			<View>
				<Text style={[styles.stepText, {
					color: isActive
						? activeLabelColor
						: inactiveLabelColor
				}]}>{title}</Text>
				{subTitle &&
					<Text style={[styles.stepSubtitle, {
						color: inactiveLabelColor
					}]}>
						{subTitle}
					</Text>}
			</View>
		</View>
	);
};

interface StepIndicatorProps {
	currentStep: number;

	stepTitles: string[];
	subTitle: string[];

	activeStepColor?: string;
	inactiveStepColor?: string;

	activeLabelColor?: string;
	inactiveLabelColor?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
	currentStep,

	stepTitles,
	subTitle,

	activeStepColor = '#006494',
	inactiveStepColor = '#c7dbe6',

	activeLabelColor = '#006494',
	inactiveLabelColor = '#c7dbe6'

}) => {
	return (
		<View>
			{stepTitles.map((title: string, index: number) => (
				<View style={styles.container} key={index}>
					{index != stepTitles.length - 1 && (
						<View style={[styles.line, {
							backgroundColor: currentStep > index + 1
								? activeStepColor
								: inactiveStepColor
						}]} />
					)}
					<StepItem
						title={title}
						subTitle={subTitle ? subTitle[index] : undefined}
						isActive={currentStep >= index + 1}
						activeStepColor={activeStepColor}
						inactiveStepColor={inactiveStepColor}
						activeLabelColor={activeLabelColor}
						inactiveLabelColor={inactiveLabelColor}
					/>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 50, margin: 5,
		justifyContent: 'center'
	},
	line: {
		height: 60, position: 'absolute',
		top: 20, bottom: 0,
		left: 5, width: 2,
	},
	stepItem: {
		borderRadius: 1, width: 12, height: 12,
		justifyContent: 'center', alignItems: 'center',
	},
	stepText: {
		left: 20,
		fontStyle: 'italic'
	},
	stepSubtitle: {
		left: 20,
		fontStyle: 'italic',
		fontSize: 10
	},
});

export default StepIndicator;