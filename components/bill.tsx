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
import { useGetBillsQuery } from '../redux/slices/billApiSlice';

const TypeAnalatisk = () => {
	const { data: bills } = useGetBillsQuery(undefined);
	
	const [monthlyData, setMonthlyData] = useState<number[]>(Array(12).fill(0)); // Initialize an array for 12 months

	useEffect(() => {
		if (bills) {
			const counts = Array(12).fill(0); // Array to hold counts for each month (Jan-Dec)

			bills.forEach((bill: { dateIn: string }) => {
				const date = new Date(bills.dateIn); // Parse date
				const month = date.getMonth(); // Get month index (0 for Jan, 1 for Feb, ..., 11 for Dec)
				counts[month] += 1; // Increment the count for the respective month
			});

			setMonthlyData(counts); // Update state with monthly data
		}
	}, [bills]);

	const [columnBasic1] = useState<IChartOptions>({
		series: [
			{
				name: 'Bills',
				data: monthlyData,
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
				categories: [
					'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
					'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
				],
			},
			yaxis: {
				title: {
					text: 'Number of Bills',
				},
				labels: {
					formatter: (val) => `${val}`, // Format Y-axis labels
				},
			},
			fill: {
				opacity: 1,
			},
			tooltip: {
				y: {
					formatter(val) {
						return `Bills: ${val}`; // Tooltip formatter
					},
				},
			},
		},
	});

	return (
		<div className='col-lg-6'>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='BarChart'>
						<CardTitle>Bills Created</CardTitle>
						<CardSubTitle>Analytics</CardSubTitle>
					</CardLabel>
				</CardHeader>
				<CardBody>
					<Chart
						series={columnBasic1.series}
						options={columnBasic1.options}
						type='bar'
						height={350}
					/>
				</CardBody>
			</Card>
		</div>
	);
};

export default TypeAnalatisk;
