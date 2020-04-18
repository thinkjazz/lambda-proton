<script>
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";



    let title = "Breadcrumb | UI";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Breadcrumb</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Breadcrumb</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Breadcrumb</h2>
        <Breadcrumb>
            <BreadcrumbItem active>Home</BreadcrumbItem>
        </Breadcrumb>

        <Breadcrumb>
            <BreadcrumbItem>
                <a href="#home">Home</a>
            </BreadcrumbItem>
            <BreadcrumbItem active>Library</BreadcrumbItem>
        </Breadcrumb>

        <Breadcrumb>
            <BreadcrumbItem>
                <a href="#home">Home</a>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <a href="#library">Library</a>
            </BreadcrumbItem>
            <BreadcrumbItem active>Data</BreadcrumbItem>
        </Breadcrumb>
    </div>
</Row>
