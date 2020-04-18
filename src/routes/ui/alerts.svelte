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


    let title = "Alerts | UI ";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Alerts</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Alerts</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Alerts</h2>
        {#each colors as color}
            <Alert {color}>
                <h4 class="alert-heading text-capitalize">{color}</h4>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                <a href="#todo" class="alert-link">
                    In addition, the links to the alerts are colored to match the alert
                </a>.
            </Alert>
        {/each}
    </div>
</Row>
