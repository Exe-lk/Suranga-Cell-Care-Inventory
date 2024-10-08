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

const PolarBasic = () => {
	// Fetch bills data
	const { data: bills } = useGetBillsQuery(undefined);

	// State to hold chart options
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

	// Update chart data when bills are fetched
	useEffect(() => {
		if (bills) {
			// Get status counts
			const statusCounts = {
				'in progress': 0,
				'completed': 0,
				'rejected': 0,
				'waiting to in progress': 0,
				'handover': 0,
			};

			// Iterate through bills to count statuses
			bills.forEach((bills: { Status: keyof typeof statusCounts }) => {
				if (statusCounts[bills.Status] !== undefined) {
					statusCounts[bills.Status]++;
				}
			});

			// Update chart series and labels
			setState({
				series: Object.values(statusCounts),
				options: {
					...state.options,
					labels: Object.keys(statusCounts),
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
						<CardSubTitle>Chart</CardSubTitle>
					</CardLabel>
				</CardHeader>
				<CardBody>
					<Chart
						series={state.series}
						options={state.options}
						
						type={state.options.chart?.type}
						width={state.options.chart?.width}
					/>
				</CardBody>
			</Card>
		</div>
	);
};

export default PolarBasic;
