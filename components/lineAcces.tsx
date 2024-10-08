import React, { useEffect, useState } from 'react';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../components/bootstrap/Card';
import Chart, { IChartOptions } from '../components/extras/Chart';
import { useGetStockInOutsQuery } from '../redux/slices/stockInOutAcceApiSlice';
import moment from 'moment';

const LineWithLabel = () => {
	// Fetch stock data from API
	const { data: stocksData, isLoading: isstocksLoading } = useGetStockInOutsQuery(undefined);

	// Initial chart state
	const [state, setState] = useState<IChartOptions>({
		series: [
			{
				name: 'Stock Out',
				data: Array(12).fill(0), // Data for 12 months (Jan-Dec)
			},
			{
				name: 'Stock In',
				data: Array(12).fill(0), // Data for 12 months (Jan-Dec)
			},
		],
		options: {
			chart: {
				height: 350,
				type: 'line',
				dropShadow: {
					enabled: true,
					color: '#000',
					top: 18,
					left: 7,
					blur: 10,
					opacity: 0.2,
				},
				toolbar: {
					show: false,
				},
			},
			tooltip: {
				theme: 'dark',
			},
			dataLabels: {
				enabled: true,
			},
			stroke: {
				curve: 'smooth',
			},
			title: {
				text: 'Stock In & Stock Out',
				align: 'left',
			},
			grid: {
				borderColor: '#e7e7e7',
				row: {
					colors: ['#f3f3f3', 'transparent'], // alternating row colors
					opacity: 0.5,
				},
			},
			markers: {
				size: 1,
			},
			xaxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				title: {
					text: 'Month',
				},
			},
			yaxis: {
				title: {
					text: 'Stock Count',
				},
				min: 0,
			},
			legend: {
				position: 'top',
				horizontalAlign: 'right',
				floating: true,
				offsetY: -25,
				offsetX: -5,
			},
		},
	});

	// Function to group stock data by month
	const groupByMonth = (data: { date: string; stock: string }[]) => {
		// Create an array for 12 months with 0 as initial value
		const monthlyData = Array(12).fill(0);

		// Loop through the data and increment the corresponding month count
		data.forEach((item) => {
			const month = moment(item.date).month(); // Get month (0-11 index)
			monthlyData[month] += 1; // Increment the count for the month
		});

		return monthlyData;
	};

	// Compute the chart data
	useEffect(() => {
		if (!isstocksLoading && stocksData) {
			// Filter stockIn and stockOut data
			const stockInData = stocksData.filter((item: { date: string; stock: string }) => item.stock === 'stockIn'); // Filter stockIn
			const stockOutData = stocksData.filter((item: { date: string; stock: string }) => item.stock === 'stockOut'); // Filter stockOut

			// Group data by month for stockIn and stockOut
			const stockInMonthly = groupByMonth(stockInData);
			const stockOutMonthly = groupByMonth(stockOutData);

			// Update the chart data with monthly values
			setState((prevState) => ({
				...prevState,
				series: [
					{
						name: 'Stock Out',
						data: stockOutMonthly,
					},
					{
						name: 'Stock In',
						data: stockInMonthly,
					},
				],
			}));
		}
	}, [stocksData, isstocksLoading]);

	return (
		<div className='col-lg-6'>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='ShowChart' iconColor='warning'>
						<CardTitle>
							Stock In & Stock Out <small>analytics</small>
						</CardTitle>
						<CardSubTitle>Monthly Stock Chart</CardSubTitle>
					</CardLabel>
				</CardHeader>
				<CardBody>
					{!isstocksLoading ? (
						<Chart
							series={state.series}
							options={state.options}
							type={state.options.chart?.type}
							height={state.options.chart?.height}
						/>
					) : (
						<p>Loading chart...</p>
					)}
				</CardBody>
			</Card>
		</div>
	);
};

export default LineWithLabel;
