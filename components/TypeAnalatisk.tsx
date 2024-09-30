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
import { useGetBrandsQuery } from '../redux/slices/brandApiSlice';
import { useGetBrands1Query } from '../redux/slices/brand1ApiSlice';
import { useGetCategoriesQuery } from '../redux/slices/categoryApiSlice';
import { useGetCategories1Query } from '../redux/slices/category1ApiSlice';
import { useGetModelsQuery } from '../redux/slices/modelApiSlice';
import { useGetModels1Query } from '../redux/slices/model1ApiSlice';

// Helper function to extract month from Firestore timestamp
const getMonthFromTimestamp = (timestamp: { seconds: number }) => {
	const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
	return date.getMonth(); // 0 is January, 11 is December
};

// Function to count occurrences per month
const countByMonth = (data: { timestamp: { seconds: number } }[]) => {
	const monthsCount = Array(12).fill(0); // Create an array for months [Jan, Feb, ..., Dec]
	if (data && Array.isArray(data)) {
		data.forEach(item => {
			const month = getMonthFromTimestamp(item.timestamp); // Extract month from timestamp
			monthsCount[month] += 1; // Increment count for that month
		});
	}
	return monthsCount;
};

const TypeAnalatisk = () => {
	// Fetching data from the APIs
	const { data: brands } = useGetBrandsQuery(undefined);
	const { data: brands1 } = useGetBrands1Query(undefined);
	const { data: categories } = useGetCategoriesQuery(undefined);
	const { data: categories1 } = useGetCategories1Query(undefined);
	const { data: models } = useGetModelsQuery(undefined);
	const { data: models1 } = useGetModels1Query(undefined);

	// State for the chart options
	const [columnBasic1, setColumnBasic1] = useState<IChartOptions>({
		series: [
			{ name: 'Model', data: [] },
			{ name: 'Category', data: [] },
			{ name: 'Brand', data: [] },
		],
		options: {
			chart: { type: 'bar', height: 350 },
			plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
			dataLabels: { enabled: false },
			stroke: { show: true, width: 2, colors: ['transparent'] },
			xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
			yaxis: { title: { text: ' (Quantity)' } },
			fill: { opacity: 1 },
			tooltip: { y: { formatter(val) { return ` ${val} Quantity`; } } },
		},
	});

	// Update the chart data once the API data is available
	useEffect(() => {
		if (brands && brands1 && categories && categories1 && models && models1) {
			// Process monthly counts for each data set
			const categoryTotals = countByMonth(categories).map((val, index) => val + countByMonth(categories1)[index]);
			const brandTotals = countByMonth(brands).map((val, index) => val + countByMonth(brands1)[index]);
			const modelTotals = countByMonth(models).map((val, index) => val + countByMonth(models1)[index]);

			// Update chart data
			setColumnBasic1({
				series: [
					{ name: 'Model', data: modelTotals },
					{ name: 'Category', data: categoryTotals },
					{ name: 'Brand', data: brandTotals },
				],
				options: { ...columnBasic1.options },
			});
		}
	}, [brands, brands1, categories, categories1, models, models1]);

	return (
		<div className='col-lg-6'>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='BarChart'>
						<CardTitle>Model Category & Brand</CardTitle>
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
