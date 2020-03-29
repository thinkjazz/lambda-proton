<script>
  import Breadcrumb from "sveltestrap/src/Breadcrumb.svelte";
  import BreadcrumbItem from "sveltestrap/src/BreadcrumbItem.svelte";
  import Card from "sveltestrap/src/Card.svelte";
  import CardBody from "sveltestrap/src/CardBody.svelte";
  import CardText from "sveltestrap/src/CardText.svelte";
</script>

<h1 class="mt-4">Светлая тема</h1>

<Breadcrumb class="mb-4">
  <BreadcrumbItem>
    <a href=".">Панель</a>
  </BreadcrumbItem>
  <BreadcrumbItem active>Светлая тема</BreadcrumbItem>
</Breadcrumb>

<Card>
  <CardBody>
    Эта страница является примером использования опции боковой навигации со сменой темы. По адресу
    присоединяющий
    <code>.l-proton-sidenav-light</code>
    класс к
    <code>.l-proton-sidenav</code>
    классу и боковая навигация будет иметь светлую цветовую схему. 
     <code>.l-proton-sidenav-dark</code>
    также доступен вариант с более темным цветом.  </CardBody>
</Card>
