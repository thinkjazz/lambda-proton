<script>
    let title = "Прогресс бар | Шкала прогресса | UI | Пользовательский Интерфейс";
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";
    import  Progress  from 'sveltestrap/src/Progress.svelte';
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



</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4"> Прогресс бар</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Прогресс бар</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Прогресс бар</h2>
        <h3 class="mt-4">Пример</h3>
        <div class="text-center">0%</div>
        <Progress />
        <div class="text-center">25%</div>
        <Progress value="25" />
        <div class="text-center">50%</div>
        <Progress value={50} />
        <div class="text-center">75%</div>
        <Progress value={75} />
        <div class="text-center">100%</div>
        <Progress value="100" />
        <div class="text-center">Множество шкал</div>
        <Progress multi>
            <Progress bar value="15" />
            <Progress bar color="success" value="30" />
            <Progress bar color="info" value="25" />
            <Progress bar color="warning" value="20" />
            <Progress bar color="danger" value="5" />
        </Progress>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Цвета</h2>
        <h3 class="mt-4">Пример</h3>
        <Progress value={2 * 5} />
        <Progress color="success" value="25" />
        <Progress color="info" value={50} />
        <Progress color="warning" value={75} />
        <Progress color="danger" value="100" />
    </div>
</Row>
