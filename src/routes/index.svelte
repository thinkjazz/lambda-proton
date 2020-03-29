<script>
  import Breadcrumb from "sveltestrap/src/Breadcrumb.svelte";
  import BreadcrumbItem from "sveltestrap/src/BreadcrumbItem.svelte";
  import Card from "sveltestrap/src/Card.svelte";
  import CardBody from "sveltestrap/src/CardBody.svelte";
  import CardHeader from "sveltestrap/src/CardHeader.svelte";
  import CardText from "sveltestrap/src/CardText.svelte";
  import CardSubtitle from "sveltestrap/src/CardSubtitle.svelte";
  import Row from "sveltestrap/src/Row.svelte";

  import DashboardCard from "../components/DashboardCard.svelte";
  import CustomCard from "../components/CustomCard.svelte";
  import Table from "../components/Table.svelte";
  import AreaChart from "../components/Charts/AreaChart.svelte";
  import BarChart from "../components/Charts/BarChart.svelte";

  let title = "λproton";
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Панель</h1>
<Breadcrumb class="mb-4">
  <BreadcrumbItem active>Панель</BreadcrumbItem>
</Breadcrumb>
<Row>
  <div class="col-xl-3 col-md-6">
    <DashboardCard cardTitle="Синяя плашка" cardColor="primary" />
  </div>
  <div class="col-xl-3 col-md-6">
    <DashboardCard cardTitle="Оранжевая плашка" cardColor="warning" />
  </div>
  <div class="col-xl-3 col-md-6">
    <DashboardCard cardTitle="Зеленая плашка" cardColor="success" />
  </div>
  <div class="col-xl-3 col-md-6">
    <DashboardCard cardTitle="Опасная плашка" cardColor="danger" />
  </div>
</Row>
<Row>
  <div class="col-xl-6">
    <CustomCard cardTitle="Пример диаграммы" cardIcon="fas fa-chart-area">
      <AreaChart />
    </CustomCard>
  </div>
  <div class="col-xl-6">
    <CustomCard cardTitle="Пример гистограммы" cardIcon="fas fa-chart-bar">
      <BarChart />
    </CustomCard>
  </div>
</Row>
<CustomCard cardTitle="Пример DataTable" cardIcon="fas fa-table">
  <Table />
</CustomCard>
