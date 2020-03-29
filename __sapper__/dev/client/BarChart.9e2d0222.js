import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, N as onMount, f as element, g as claim_element, h as children, j as detach_dev, k as attr_dev, l as add_location, n as insert_dev, B as noop } from './client.e349a4c9.js';
import { C as Chart } from './AreaChart.3c6ce5b1.js';

/* src\components\Charts\BarChart.svelte generated by Svelte v3.18.1 */
const file = "src\\components\\Charts\\BarChart.svelte";

function create_fragment(ctx) {
	let canvas;

	const block = {
		c: function create() {
			canvas = element("canvas");
			this.h();
		},
		l: function claim(nodes) {
			canvas = claim_element(nodes, "CANVAS", { id: true });
			children(canvas).forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(canvas, "id", "barChart");
			add_location(canvas, file, 38, 0, 747);
		},
		m: function mount(target, anchor) {
			insert_dev(target, canvas, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(canvas);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self) {
	const chartData = {
		labels: ["January", "February", "March", "April", "May", "June"],
		datasets: [
			{
				label: "# of Votes",
				data: [4, 6, 10, 12, 15, 19],
				backgroundColor: "rgba(3,117,220)"
			}
		]
	};

	const chartOptions = {
		scales: {
			yAxes: [{ ticks: { beginAtZero: true } }]
		}
	};

	function createChart() {
		var ctx = document.getElementById("barChart");

		var myChart = new Chart(ctx,
		{
				type: "bar",
				data: chartData,
				options: chartOptions
			});
	}

	onMount(createChart);

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		
	};

	return [];
}

class BarChart extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "BarChart",
			options,
			id: create_fragment.name
		});
	}
}

export { BarChart as B };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFyQ2hhcnQuOWUyZDAyMjIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0NoYXJ0cy9CYXJDaGFydC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSBcInN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDaGFydCBmcm9tIFwiY2hhcnQuanNcIjtcclxuXHJcbiAgY29uc3QgY2hhcnREYXRhID0ge1xyXG4gICAgbGFiZWxzOiBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiXSxcclxuICAgIGRhdGFzZXRzOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBsYWJlbDogXCIjIG9mIFZvdGVzXCIsXHJcbiAgICAgICAgZGF0YTogWzQsIDYsIDEwLCAxMiwgMTUsIDE5XSxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgzLDExNywyMjApXCJcclxuICAgICAgfVxyXG4gICAgXVxyXG4gIH07XHJcbiAgY29uc3QgY2hhcnRPcHRpb25zID0ge1xyXG4gICAgc2NhbGVzOiB7XHJcbiAgICAgIHlBeGVzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGlja3M6IHtcclxuICAgICAgICAgICAgYmVnaW5BdFplcm86IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVDaGFydCgpIHtcclxuICAgIHZhciBjdHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhckNoYXJ0XCIpO1xyXG4gICAgdmFyIG15Q2hhcnQgPSBuZXcgQ2hhcnQoY3R4LCB7XHJcbiAgICAgIHR5cGU6IFwiYmFyXCIsXHJcbiAgICAgIGRhdGE6IGNoYXJ0RGF0YSxcclxuICAgICAgb3B0aW9uczogY2hhcnRPcHRpb25zXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uTW91bnQoY3JlYXRlQ2hhcnQpO1xyXG48L3NjcmlwdD5cclxuXHJcbjxjYW52YXMgaWQ9XCJiYXJDaGFydFwiIC8+XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BSVEsU0FBUztFQUNiLE1BQU0sR0FBRyxTQUFTLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU07RUFDL0QsUUFBUTs7SUFFSixLQUFLLEVBQUUsWUFBWTtJQUNuQixJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0lBQzNCLGVBQWUsRUFBRSxpQkFBaUI7Ozs7O09BSWxDLFlBQVk7RUFDaEIsTUFBTTtHQUNKLEtBQUssS0FFRCxLQUFLLElBQ0gsV0FBVyxFQUFFLElBQUk7Ozs7VUFPbEIsV0FBVztNQUNkLEdBQUcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVU7O01BQ3hDLE9BQU8sT0FBTyxLQUFLLENBQUMsR0FBRzs7SUFDekIsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsU0FBUztJQUNmLE9BQU8sRUFBRSxZQUFZOzs7O0NBSXpCLE9BQU8sQ0FBQyxXQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
