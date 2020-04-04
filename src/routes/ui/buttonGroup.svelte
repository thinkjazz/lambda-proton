<script>
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";
    import  Button from "sveltestrap/src/Button.svelte";
    import  ButtonGroup from "sveltestrap/src/ButtonGroup.svelte";
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


    let title = "Группы кнопок | UI | Пользовательский Интерфейс";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Группы кнопок</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Группы кнопок</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Группы кнопок</h2>
        <ButtonGroup>
            <Button active>Alpha</Button>
            <Button>Bravo</Button>
            <Button>Charlie</Button>
        </ButtonGroup>
    </div>
</Row>
