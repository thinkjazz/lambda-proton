<script>
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";
    import  Button from "sveltestrap/src/Button.svelte";
    import  ButtonGroup from "sveltestrap/src/ButtonGroup.svelte";
    import  ButtonToolbar from  "sveltestrap/src/ButtonToolbar.svelte";
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


    let title = "Кнопки | UI | Пользовательский интерфейс";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Кнопки</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Кнопки</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Цветные</h2>
        <h4 class="mt-4">Пример</h4>
        {#each colors as color}
            <div>
                <p></p>
                <Button {color}>
                    {color}
                </Button>
            </div>
        {/each}
    </div>
    <div class="col-xl-6">
        <h2 class="mt-4">Контурные</h2>
        <h4 class="mt-4">Пример</h4>
        {#each colors as color}
            <div>
                <p></p>
                <Button outline {color}>
                    {color}
                </Button>
            </div>
        {/each}
    </div>
</Row>

<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Неактивные</h2>
        <h4 class="mt-4">Пример</h4>
        {#each colors as color}
            <div>
                <p></p>
                <Button disabled {color}>
                    {color}
                </Button>
            </div>
        {/each}
    </div>
    <div class="col-xl-6">
        <h2 class="mt-4">Размеры</h2>
        <Button size="lg">Большие</Button>
        <Button size="sm">Маленькие</Button>
        <Button block>Блок</Button>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Группы кнопок</h2>
        <ButtonGroup>
            <Button active>Альфа</Button>
            <Button>Браво</Button>
            <Button>Чарли</Button>
        </ButtonGroup>
    </div>
    <div class="col-xl-6">
        <h2 class="mt-4">Тулбары с кнопками</h2>
        <ButtonToolbar>
            <Button>Альфа</Button>
            <Button>Браво</Button>
            <Button>Чарли</Button>
        </ButtonToolbar>
    </div>
</Row>
<Row>
    <div class="col-xl-12">
 <br> <br>
    </div>
</Row>
