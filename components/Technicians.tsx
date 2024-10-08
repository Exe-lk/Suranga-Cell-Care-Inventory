import React, { useState, useEffect } from 'react';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from './bootstrap/Card';
import Chart, { IChartOptions } from './extras/Chart';
import CommonStoryBtn from '../common/partial/other/CommonStoryBtn';
import { useGetTechniciansQuery } from '../redux/slices/technicianManagementApiSlice';
import { useGetBillsQuery } from '../redux/slices/billApiSlice';

const TypeAnalatisk = () => {
	// Fetch technicians from the API
	const { data: technicians, isLoading: isLoadingTechnicians } = useGetTechniciansQuery(undefined);
	// Fetch bills from the API
	const { data: bills, isLoading: isLoadingBills } = useGetBillsQuery(undefined);

	// Local state to store chart data
	const [columnBasic1, setColumnBasic1] = useState<IChartOptions>({
		series: [
			{
				name: 'Technicians',
				data: [], // This will be dynamically filled with bill counts
			},
		],
		options: {
			chart: {
				type: 'bar',
				height: 350,
			},
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
				},
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent'],
			},
			xaxis: {
				categories: [], // This will be dynamically filled with technician names
			},
			yaxis: {
				title: {
					text: 'Bill Count',
				},
			},
			fill: {
				opacity: 1,
			},
			tooltip: {
				y: {
					formatter(val) {
						return `${val} bills`;
					},
				},
			},
		},
	});

	// Update chart data once we have the technicians and bills data
	useEffect(() => {
		if (!isLoadingTechnicians && !isLoadingBills && technicians && bills) {
			// Extract technician names and their corresponding technicianNum
			const technicianNames = technicians.map((tech: any) => tech.name);
			const billCounts = technicians.map((tech: any) => {
				// Count the bills for each technician by technicianNum
				return bills.filter((bill: any) => bill.technicianNum === tech.technicianNum).length;
			});

			// Update the chart data
			setColumnBasic1((prevState) => ({
				...prevState,
				series: [{ name: 'Technicians', data: billCounts }],
				options: {
					...prevState.options,
					xaxis: {
						...prevState.options.xaxis,
						categories: technicianNames,
					},
				},
			}));
		}
	}, [technicians, bills, isLoadingTechnicians, isLoadingBills]);

	return (
		<div className='col-lg-6'>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='BarChart'>
						<CardTitle>Technicians Work History</CardTitle>
						<CardSubTitle>Analytics</CardSubTitle>
					</CardLabel>
				</CardHeader>
				<CardBody>
					{isLoadingTechnicians || isLoadingBills ? (
						<p>Loading...</p>
					) : (
						<Chart
							series={columnBasic1.series}
							options={columnBasic1.options}
							type='bar'
							height={350}
						/>
					)}
				</CardBody>
			</Card>
		</div>
	);
};

export default TypeAnalatisk;
