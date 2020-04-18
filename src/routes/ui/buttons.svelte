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


    let title = "Buttons | UI";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Buttons</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Buttons</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Colors</h2>
        <h4 class="mt-4">Example</h4>
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
        <h2 class="mt-4">Contour buttons</h2>
        <h4 class="mt-4">Example</h4>
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
        <h2 class="mt-4">Disabled</h2>
        <h4 class="mt-4">Example</h4>
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
        <h2 class="mt-4">Size</h2>
        <Button size="lg">Large</Button>
        <Button size="sm">Small</Button>
        <Button block>Block</Button>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Buttons group</h2>
        <ButtonGroup>
            <Button active>Alpha</Button>
            <Button>Beta</Button>
            <Button>Gamma</Button>
        </ButtonGroup>
    </div>
    <div class="col-xl-6">
        <h2 class="mt-4">Toolbar with buttons</h2>
        <ButtonToolbar>
            <Button>Alpha</Button>
            <Button>Beta</Button>
            <Button>Gamma</Button>
        </ButtonToolbar>
    </div>
</Row>
<Row>
    <div class="col-xl-12">
 <br> <br>
    </div>
</Row>
