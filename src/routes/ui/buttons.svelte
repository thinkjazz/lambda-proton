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


    let title = "Кнопки";
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
        <h1 class="mt-4">Цвета кнопок</h1>
        {#each colors as color}
            <div>
                <Button {color}>
                    {color}
                </Button>
            </div>
        {/each}
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h1 class="mt-4">Кнопки с контурами</h1>
        {#each colors as color}
            <div>
                <Button outline {color}>
                    {color}
                </Button>
            </div>
        {/each}
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h1 class="mt-4">Неактивные</h1>
        {#each colors as color}
            <div>
                <Button disabled {color}>
                    {color}
                </Button>
            </div>
        {/each}
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h1 class="mt-4">Размеры</h1>
        <Button size="lg">Large</Button>
        <Button size="sm">Small</Button>
        <Button block>Block</Button>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h1 class="mt-4">Группы кнопок</h1>
        <ButtonGroup>
            <Button active>Alpha</Button>
            <Button>Bravo</Button>
            <Button>Charlie</Button>
        </ButtonGroup>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h1 class="mt-4">Тулбар</h1>
        <ButtonToolbar>
            <Button>Alpha</Button>
            <Button>Bravo</Button>
            <Button>Charlie</Button>
        </ButtonToolbar>
    </div>
</Row>
