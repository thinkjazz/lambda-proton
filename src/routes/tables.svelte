<script>
  import Breadcrumb from "sveltestrap/src/Breadcrumb.svelte";
  import BreadcrumbItem from "sveltestrap/src/BreadcrumbItem.svelte";
  import Card from "sveltestrap/src/Card.svelte";
  import CardBody from "sveltestrap/src/CardBody.svelte";
  import CardHeader from "sveltestrap/src/CardHeader.svelte";

  import Table from "../components/Table.svelte";
</script>

<h1 class="mt-4">Таблицы</h1>
<Breadcrumb class="mb-4">
  <BreadcrumbItem>
    <a href=".">Панель</a>
  </BreadcrumbItem>
  <BreadcrumbItem active>Таблицы</BreadcrumbItem>
</Breadcrumb>

<Card class="mb-4">
  <CardBody>
    DataTables является сторонним плагином, который используется для генерации демонстрационной таблицы.
    Внизу. Для получения более подробной информации о Таблицах Данных, пожалуйста, посетите веб-сайт
    <a target="_blank" href="https://datatables.net/">
      официальная документация DataTables
    </a>
    .
  </CardBody>
</Card>

<Card class="mb-4">
  <CardHeader>
    <svg
      class="svg-inline--fa fa-table fa-w-16"
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="table"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      data-fa-i2svg="">
      <path
        fill="currentColor"
        d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51
        0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224
        416H64v-96h160v96zm0-160H64v-96h160v96zm224
        160H288v-96h160v96zm0-160H288v-96h160v96z" />
    </svg>
    Пример DataTable
  </CardHeader>
  <CardBody>
    <Table />
  </CardBody>
</Card>
