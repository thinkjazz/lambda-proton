<script>
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";



    let title = "Хлебные крошки | UI | Пользовательский интерфейс";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Хлебные крошки</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Хлебные крошки</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Хлебные крошки</h2>
        <Breadcrumb>
            <BreadcrumbItem active>Домой</BreadcrumbItem>
        </Breadcrumb>

        <Breadcrumb>
            <BreadcrumbItem>
                <a href="#home">Домой</a>
            </BreadcrumbItem>
            <BreadcrumbItem active>Библиотека</BreadcrumbItem>
        </Breadcrumb>

        <Breadcrumb>
            <BreadcrumbItem>
                <a href="#home">Домой</a>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <a href="#library">Библиотека</a>
            </BreadcrumbItem>
            <BreadcrumbItem active>Данные</BreadcrumbItem>
        </Breadcrumb>
    </div>
</Row>
