<script>
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";
      import { Spinner } from "sveltestrap";
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


    let title = "Loaders | UI";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Loader</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Loader</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Colors</h2>
        {#each colors as color}
            <Spinner {color} />
        {/each}
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Types</h2>

        <div>
            {#each colors as color}
                <Spinner {color} type="border" />
            {/each}
        </div>

        <div>
            {#each colors as color}
                <Spinner {color} type="grow" />
            {/each}
        </div>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Size</h2>

        <Spinner size="sm" />
        <Spinner size="sm" type="grow" />

    </div>
</Row>
