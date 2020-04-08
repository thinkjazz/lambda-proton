import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, N as onMount, f as element, g as claim_element, h as children, j as detach_dev, k as attr_dev, l as add_location, n as insert_dev, B as noop } from './client.b2b26ffe.js';
import { C as Chart } from './AreaChart.67610810.js';

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
			add_location(canvas, file, 38, 0, 709);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFyQ2hhcnQuODI3ZTU2NjQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0NoYXJ0cy9CYXJDaGFydC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgaW1wb3J0IHsgb25Nb3VudCB9IGZyb20gXCJzdmVsdGVcIjtcbiAgaW1wb3J0IENoYXJ0IGZyb20gXCJjaGFydC5qc1wiO1xuXG4gIGNvbnN0IGNoYXJ0RGF0YSA9IHtcbiAgICBsYWJlbHM6IFtcIkphbnVhcnlcIiwgXCJGZWJydWFyeVwiLCBcIk1hcmNoXCIsIFwiQXByaWxcIiwgXCJNYXlcIiwgXCJKdW5lXCJdLFxuICAgIGRhdGFzZXRzOiBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiBcIiMgb2YgVm90ZXNcIixcbiAgICAgICAgZGF0YTogWzQsIDYsIDEwLCAxMiwgMTUsIDE5XSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcInJnYmEoMywxMTcsMjIwKVwiXG4gICAgICB9XG4gICAgXVxuICB9O1xuICBjb25zdCBjaGFydE9wdGlvbnMgPSB7XG4gICAgc2NhbGVzOiB7XG4gICAgICB5QXhlczogW1xuICAgICAgICB7XG4gICAgICAgICAgdGlja3M6IHtcbiAgICAgICAgICAgIGJlZ2luQXRaZXJvOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUNoYXJ0KCkge1xuICAgIHZhciBjdHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhckNoYXJ0XCIpO1xuICAgIHZhciBteUNoYXJ0ID0gbmV3IENoYXJ0KGN0eCwge1xuICAgICAgdHlwZTogXCJiYXJcIixcbiAgICAgIGRhdGE6IGNoYXJ0RGF0YSxcbiAgICAgIG9wdGlvbnM6IGNoYXJ0T3B0aW9uc1xuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VudChjcmVhdGVDaGFydCk7XG48L3NjcmlwdD5cblxuPGNhbnZhcyBpZD1cImJhckNoYXJ0XCIgLz5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BSVEsU0FBUztFQUNiLE1BQU0sR0FBRyxTQUFTLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU07RUFDL0QsUUFBUTs7SUFFSixLQUFLLEVBQUUsWUFBWTtJQUNuQixJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0lBQzNCLGVBQWUsRUFBRSxpQkFBaUI7Ozs7O09BSWxDLFlBQVk7RUFDaEIsTUFBTTtHQUNKLEtBQUssS0FFRCxLQUFLLElBQ0gsV0FBVyxFQUFFLElBQUk7Ozs7VUFPbEIsV0FBVztNQUNkLEdBQUcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVU7O01BQ3hDLE9BQU8sT0FBTyxLQUFLLENBQUMsR0FBRzs7SUFDekIsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsU0FBUztJQUNmLE9BQU8sRUFBRSxZQUFZOzs7O0NBSXpCLE9BQU8sQ0FBQyxXQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
