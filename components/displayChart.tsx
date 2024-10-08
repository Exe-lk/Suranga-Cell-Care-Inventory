import React, { useEffect, useState } from 'react';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../components/bootstrap/Card';
import Chart, { IChartOptions } from '../components/extras/Chart';
import { useGetStockInOutsQuery } from '../redux/slices/stockInOutDissApiSlice';

const PieBasic = () => {
	// Fetch stock in/out data
	const { data: stocksData, isLoading: isstocksLoading } = useGetStockInOutsQuery(undefined);

	// State for chart options
	const [state, setState] = useState<IChartOptions>({
		series: [0, 0], // Default series for stockIn and stockOut
		options: {
			chart: {
				width: 380,
				type: 'pie',
			},
			labels: ['Stock In', 'Stock Out'],
			responsive: [
				{
					breakpoint: 480,
					options: {
						chart: {
							width: 200,
						},
						legend: {
							position: 'bottom',
						},
					},
				},
			],
		},
	});

	// Compute and update chart when data is fetched
	useEffect(() => {
		if (!isstocksLoading && stocksData) {
			// Filter stockIn and stockOut data
			const stockInData = stocksData.filter((item: { stock: string }) => item.stock === 'stockIn');  // Filter stockIn
			const stockOutData = stocksData.filter((item: { stock: string }) => item.stock === 'stockOut'); // Filter stockOut

			// Get counts
			const stockInCount = stockInData.length || 0;
			const stockOutCount = stockOutData.length || 0;

			// Log filtered data and counts for debugging
			console.log('Stock In Data:', stockInData);
			console.log('Stock In Count:', stockInCount);
			console.log('Stock Out Data:', stockOutData);
			console.log('Stock Out Count:', stockOutCount);

			// Total count
			const totalCount = stockInCount + stockOutCount;
			console.log('Total Count:', totalCount);

			// Avoid division by zero
			if (totalCount > 0) {
				// Calculate percentage for each stock category
				const stockInPercentage = ((stockInCount / totalCount) * 100).toFixed(2);
				const stockOutPercentage = ((stockOutCount / totalCount) * 100).toFixed(2);

				// Update chart series with calculated percentages
				setState((prevState) => ({
					...prevState,
					series: [parseFloat(stockInPercentage), parseFloat(stockOutPercentage)],
				}));
			}
		}
	}, [stocksData, isstocksLoading]);

	return (
		<div className='col-lg-6'>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='PieChart'>
						<CardTitle>
							Stock In/Out <small>analytics</small>
						</CardTitle>
					</CardLabel>
				</CardHeader>
				<CardBody>
					{!isstocksLoading ? (
						<Chart
							series={state.series}
							options={state.options}
							type={state.options.chart?.type}
							width={state.options.chart?.width}
						/>
					) : (
						<p>Loading chart...</p>
					)}
				</CardBody>
			</Card>
		</div>
	);
};

export default PieBasic;
