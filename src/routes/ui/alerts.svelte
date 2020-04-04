<script>
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";
    import  Alert  from "sveltestrap/src/Alert.svelte";

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


    let title = "Оповещения";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Оповещения</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Оповещения</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        {#each colors as color}
            <Alert {color}>
                <h4 class="alert-heading text-capitalize">{color}</h4>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                <a href="#todo" class="alert-link">
                    Кроме того, ссылки на оповещения цветные, чтобы соответствовать оповещению
                </a>.
            </Alert>
        {/each}
    </div>
</Row>
