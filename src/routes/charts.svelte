<script>
  import Breadcrumb from "sveltestrap/src/Breadcrumb.svelte";
  import BreadcrumbItem from "sveltestrap/src/BreadcrumbItem.svelte";
  import Card from "sveltestrap/src/Card.svelte";
  import CardBody from "sveltestrap/src/CardBody.svelte";
  import CardHeader from "sveltestrap/src/CardHeader.svelte";
  import CardFooter from "sveltestrap/src/CardFooter.svelte";
  import Row from "sveltestrap/src/Row.svelte";

  import AreaChart from "../components/Charts/AreaChart.svelte";
  import BarChart from "../components/Charts/BarChart.svelte";
  import PieChart from "../components/Charts/PieChart.svelte";

  let cardFooterText = "Обновлено вчера в 23:59";
  let areaCardTitle = "Пример диаграммы региона";
  let barCardTitle = "Пример гистограммы";
  let pieCardTitle = "Пример круговой диаграммы";
</script>

<h1 class="mt-4">Диаграммы</h1>
<Breadcrumb class="mb-4">
  <BreadcrumbItem>
    <a href=".">Панель</a>
  </BreadcrumbItem>
  <BreadcrumbItem active>Диаграммы</BreadcrumbItem>
</Breadcrumb>

<Card class="mb-4">
  <CardBody>
    Chart.js является сторонним плагином, который используется для генерации графиков в этом
    шаблон. Приведенные ниже графики были настроены - для дальнейшей настройки.
    варианты, пожалуйста, посетите официальный
    <a target="_blank" href="https://www.chartjs.org/docs/latest/">
      Chart.js документация
    </a>
    .
  </CardBody>
</Card>

<Card class="mb-4">
  <CardHeader>
    <i class="fas fa-chart-area" />
    {areaCardTitle}
  </CardHeader>
  <CardBody>
    <AreaChart />
  </CardBody>
  <CardFooter class="small text-muted">{cardFooterText}</CardFooter>
</Card>

<Row>
  <div class="col-lg-6">
    <Card class="mb-4">
      <CardHeader>
        <i class="fas fa-chart-bar" />
        {barCardTitle}
      </CardHeader>
      <CardBody>
        <BarChart />
      </CardBody>
      <CardFooter class="small text-muted">{cardFooterText}</CardFooter>
    </Card>
  </div>
  <div class="col-lg-6">
    <Card class="mb-4">
      <CardHeader>
        <i class="fas fa-chart-pie" />
        {pieCardTitle}
      </CardHeader>
      <CardBody>
        <PieChart />
      </CardBody>
      <CardFooter class="small text-muted">{cardFooterText}</CardFooter>
    </Card>
  </div>
</Row>
