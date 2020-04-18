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


    let title = "Button group | UI";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">ГButton group</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Button group</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Button group</h2>
        <ButtonGroup>
            <Button active>Alfa</Button>
            <Button>Beta</Button>
            <Button>Gamma</Button>
        </ButtonGroup>
    </div>
</Row>
