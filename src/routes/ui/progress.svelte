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
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">С метками</h2>
        <h3 class="mt-4">Пример</h3>
        <Progress value="25">25%</Progress>
        <Progress value={50}>1/2</Progress>
        <Progress value={75}>Ты почти тут</Progress>
        <Progress color="success" value="100">Ты сделал это</Progress>
        <Progress multi>
            <Progress bar value="15">Кек</Progress>
            <Progress bar color="success" value="30">Азазаз!</Progress>
            <Progress bar color="info" value="25">Ахах</Progress>
            <Progress bar color="warning" value="20">20%</Progress>
            <Progress bar color="danger" value="5">!!</Progress>
        </Progress>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">С полосками</h2>
        <h3 class="mt-4">Пример</h3>
        <Progress striped value={2 * 5} />
        <Progress striped color="success" value="25" />
        <Progress striped color="info" value={50} />
        <Progress striped color="warning" value={75} />
        <Progress striped color="danger" value="100" />
        <Progress multi>
            <Progress striped bar value="10" />
            <Progress striped bar color="success" value="30" />
            <Progress striped bar color="warning" value="20" />
            <Progress striped bar color="danger" value="20" />
        </Progress>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Анимированные</h2>
        <h3 class="mt-4">Пример</h3>
        <Progress animated value={2 * 5} />
        <Progress animated color="success" value="25" />
        <Progress animated color="info" value={50} />
        <Progress animated color="warning" value={75} />
        <Progress animated color="danger" value="100" />
        <Progress multi>
            <Progress animated bar value="10" />
            <Progress animated bar color="success" value="30" />
            <Progress animated bar color="warning" value="20" />
            <Progress animated bar color="danger" value="20" />
        </Progress>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Комбинированные</h2>
        <h3 class="mt-4">Пример</h3>
        <div class="text-center">Flat</div>
        <Progress multi>
            <Progress bar value="15" />
            <Progress bar color="success" value="20" />
            <Progress bar color="info" value="25" />
            <Progress bar color="warning" value="20" />
            <Progress bar color="danger" value="15" />
        </Progress>
        <div class="text-center">С метками</div>
        <Progress multi>
            <Progress bar value="15">Хех</Progress>
            <Progress bar color="success" value="35">Ох!</Progress>
            <Progress bar color="warning" value="25">25%</Progress>
            <Progress bar color="danger" value="25">Гляди!!</Progress>
        </Progress>
        <div class="text-center">Полоски и анимация</div>
        <Progress multi>
            <Progress bar striped value="15">Полоски</Progress>
            <Progress bar animated color="success" value="30">Анимированные полоски</Progress>
            <Progress bar color="info" value="25">Гладкая</Progress>
        </Progress>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">C максимальными значениям</h2>
        <h3 class="mt-4">Пример</h3>
        <div class="text-center">Flat</div>
        <div class="text-center">1 of 5</div>
        <Progress value="1" max="5" />
        <div class="text-center">50 of 135</div>
        <Progress value={50} max="135" />
        <div class="text-center">75 of 111</div>
        <Progress value={75} max={111} />
        <div class="text-center">463 of 500</div>
        <Progress value="463" max={500} />

        <div class="text-center">Разное (40) of 55</div>
        <Progress multi>
            <Progress bar value="5" max={55}>5</Progress>
            <Progress bar color="success" value="15" max={55}>15</Progress>
            <Progress bar color="warning" value="10" max={55}>10</Progress>
            <Progress bar color="danger" value="10" max={55}>10</Progress>
        </Progress>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <br>
    </div>
</Row>
