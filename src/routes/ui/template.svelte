<script>
    let title = "Пагинация | UI | Пользовательский Интерфейс";
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

    </div>
</Row>
