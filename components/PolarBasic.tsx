import React, { useEffect, useState } from 'react';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from './bootstrap/Card';
import Chart, { IChartOptions } from './extras/Chart';
import { useGetBillsQuery } from '../redux/slices/billApiSlice';

const PolarBasic = () => {
	// Fetch bills data
	const { data: bills } = useGetBillsQuery(undefined);

	// State to hold chart options and series
	const [state, setState] = useState<IChartOptions>({
		series: [],
		options: {
			chart: {
				type: 'polarArea',
			},
			stroke: {
				colors: ['#fff'],
			},
			fill: {
				opacity: 0.8,
			},
			labels: [], // Labels for the statuses
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

	// Effect to update chart data when bills are fetched
	useEffect(() => {
		if (bills) {
			// Initialize an object to count statuses
			const statusCounts = {
				'in progress to complete': 0,
				'reject': 0,
				'completed': 0,
				'in progress': 0,
				'waiting to in progress': 0,
				'HandOver': 0,
			};

			// Iterate through bills to count the statuses
			bills.forEach((bill: { Status: keyof typeof statusCounts }) => {
				if (statusCounts[bill.Status] !== undefined) {
					statusCounts[bill.Status]++; // Increment count based on status
				}
			});

			// Update chart data (series and labels)
			setState({
				series: Object.values(statusCounts), // Counts for each status
				options: {
					...state.options,
					labels: Object.keys(statusCounts), // Status labels for the chart
				},
			});
		}
	}, [bills]);

	return (
		<div className='col-lg-6'>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='TrackChanges'>
						<CardTitle>Status Distribution of Phone Repairs</CardTitle>
						<CardSubTitle>Polar Area Chart</CardSubTitle>
					</CardLabel>
				</CardHeader>
				<CardBody>
					<Chart
						series={state.series} // Status counts
						options={state.options} // Chart options including labels
						type={state.options.chart?.type} // Polar chart type
						width={state.options.chart?.width} // Chart width (adjustable for responsiveness)
					/>
				</CardBody>
			</Card>
		</div>
	);
};

export default PolarBasic;
