import React, { useState } from 'react';
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

const TypeAnalatisk = () => {
	const [columnBasic1] = useState<IChartOptions>({
		series: [
			{
				name: 'Model',
				data: [44, 55, 57, 56, 61,56,89,56,45,],
			},
			{
				name: 'Category',
				data: [76, 85, 101, 98, 87,56,89,45,78],
			},
			{
				name: 'Brand',
				data: [35, 41, 36, 26, 45,25,36,98,56,],
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
					// @ts-ignore
					endingShape: 'rounded',
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
				categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
			},
			yaxis: {
				title: {
					text: '$ (thousands)',
				},
			},
			fill: {
				opacity: 1,
			},
			tooltip: {
				y: {
					formatter(val) {
						return `$ ${val} thousands`;
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
						<CardTitle>
						Model Category & Brand
						</CardTitle>
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