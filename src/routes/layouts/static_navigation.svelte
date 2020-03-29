<script>
  import Breadcrumb from "sveltestrap/src/Breadcrumb.svelte";
  import BreadcrumbItem from "sveltestrap/src/BreadcrumbItem.svelte";
  import Card from "sveltestrap/src/Card.svelte";
  import CardBody from "sveltestrap/src/CardBody.svelte";
  import CardText from "sveltestrap/src/CardText.svelte";
</script>

<h1 class="mt-4">Статическая навигация</h1>
<Breadcrumb class="mb-4">
  <BreadcrumbItem>
    <a href=".">Панель</a>
  </BreadcrumbItem>
  <BreadcrumbItem active>Статическая навигация</BreadcrumbItem>
</Breadcrumb>

<Card class="mb-4">
  <CardBody>
    <p class="mb-0">
      Эта страница является примером использования статической навигации. Удаляя     
      <code>.l-proton-nav-fixed</code>
       класс из
      <code>body</code>
      верхняя навигация и боковая навигация станут статичными при прокрутке.
      Прокрутите эту страницу вниз, чтобы увидеть пример.
    </p>
  </CardBody>
</Card>
<div style="height: 100vh;" />
<Card class="mb-4">
  <CardBody>
    При прокрутке навигация остается в верхней части страницы. Это конец
    статической навигационной демонстрации
  </CardBody>
</Card>
