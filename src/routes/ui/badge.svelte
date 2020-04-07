<script>
    import Breadcrumb from "sveltestrap/src/Breadcrumb.svelte";
    import BreadcrumbItem from "sveltestrap/src/BreadcrumbItem.svelte";
    import Row from "sveltestrap/src/Row.svelte";
    import Badge from "sveltestrap/src/Badge.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    const colors = [
        "primary",
        "secondary",
        "success",
        "danger",
        "warning",
        "info",
        "light",
        "dark"
    ];
    let title = "Значки | UI | Пользовательский интерфейс";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Значки</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Значки</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Пример</h2>
        <h1>Заголовок <Badge color="success">Новый</Badge></h1>
        <h2>Заголовок <Badge color="warning" >Новый</Badge></h2>
        <h3>Заголовок <Badge color="danger" >Новый</Badge></h3>
        <h4>Заголовок <Badge>Новый</Badge></h4>
        <h5>Заголовок <Badge>Новый</Badge></h5>
        <h6>Заголовок <Badge>Новый</Badge></h6>
    </div>
    <div class="col-xl-6">
        <h2 class="mt-4">Уведомление</h2>
        <h4 class="mt-4">Пример</h4>
        <Button color="primary" outline>
            Уведомление <Badge color="secondary">4</Badge>
        </Button>
    </div>
    <div class="col-xl-6">

        <h2 class="mt-4">Цвета</h2>
        <h4 class="mt-4">Пример</h4>
        {#each colors as color}
            <div>
                <Badge {color}>
                    {color}
                </Badge>
            </div>
        {/each}
    </div>
    <div class="col-xl-6">
        <h2 class="mt-4">Округлые значки</h2>
        <h4 class="mt-4">Пример</h4>
        {#each colors as color}
            <div>
                <Badge pill {color}>
                    {color}
                </Badge>
            </div>
        {/each}
    </div>
</Row>
  <Row>
      <div class="col-xl-12">
          <h2 class="mt-4">Цветные значки</h2>
          <h4 class="mt-4">Пример</h4>
          <Badge href="#" color="primary">Основной</Badge>
          <Badge href="#" color="secondary">Вторичный</Badge>
          <Badge href="#" color="success">Успешно</Badge>
          <Badge href="#" color="danger">Опасность</Badge>
          <Badge href="#" color="warning">Предупреждение</Badge>
          <Badge href="#" color="info">Информация</Badge>
          <Badge href="#" color="light">Светлый</Badge>
          <Badge href="#" color="dark">Тёмный</Badge>
      </div>
  </Row>


<Row>
    <div class="col-xl-12">
        <br>
    </div>
</Row>
