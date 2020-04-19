<script>
    let title = "Коллапсер | UI | Пользовательский Интерфейс";
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";
    import  Button from "sveltestrap/src/Button.svelte";
    import  Collapse from "sveltestrap/src/Collapse.svelte";
    import  CardBody from "sveltestrap/src/CardBody.svelte";
    import  Card from "sveltestrap/src/Card.svelte";
    import  UncontrolledCollapse from "sveltestrap/src/UncontrolledCollapse.svelte";

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
    let isOpen = false;

    let status ="Closed";
    const onEntering = () => (status = "Opening...");
    const onEntered = () => (status = "Open");
    const onExiting = () => (status = "Closing...");
    const onExited = () => (status = "Close");


</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Collapse</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Collapse</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Collapse</h2>
        <p class="lead">
            Switch the visibility of the content in your project
            using several classes and our JavaScript plugins.
        </p>
        <h3 class="mt-4"> How it works</h3>
        <p>
            The JavaScript plugin is used to display and hide
            of the contents.
            Buttons or anchors are used as triggers,
            that bind to certain elements,
            that you will switch. The folding element animates the height from the current value to 0.
            Given how CSS handles the animation, you cannot use the padding on the folding element.
            Instead, use the class as an independent wrapper.
            The effect of the animation of this element depends on the media request.
            "Preference is motion reduction.</p>
    </div>
    <div class="col-xl-6">
        <h3 class="mt-4"><small>Example</small></h3>
        <Button color="primary" on:click={() => (isOpen = !isOpen)} class="mb-3">
            Switch
        </Button>
        <Collapse {isOpen}>
            <Card body>
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                richardson ad squid. Nihil anim keffiyeh helvetica,
                craft beer labore wes
                anderson cred nesciunt sapiente ea proident.
            </Card>
        </Collapse>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Events</h2>
        <p>
            Use the props <code>
            on:onEntering, onEntering, onExiting и onExited
        </code>
            for callbacks after
            how Collapse will complete the opening (entering) or closing (exiting).
        </p>
    </div>
    <div class="col-xl-6">
        <h3 class="mt-4"><small>Example</small></h3>
        <Button color="primary" on:click={() => (isOpen = !isOpen)} class="mb-3">
            Switcher
        </Button>
        <h5>Current status: {status}</h5>
        <Collapse {isOpen} {onEntering} {onEntered} {onExiting} {onExited}>
            <Card body>
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes
                anderson cred nesciunt sapiente ea proident.
            </Card>
        </Collapse>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Uncontrolled Collapse without isOpen</h2>
        <p>
            For the simplest of uses, uncontrolled
            the component can provide the required functionality without
            the need to manage/control the condition of the component.
            <code>UncontrolledCollapse</code> does not require <code>isOpen</code> prop.
            Instead, pass the switch props.
            The switch is the line that will start <code>querySelectorAll</code>.
            to find the dom-elements that initiate the switching.
        </p>
    </div>
    <div class="col-xl-6">
        <h3 class="mt-4"><small>Example</small></h3>
        <Button color="primary" id="toggler" class="mb-3">Toggle</Button>
        <UncontrolledCollapse toggler="#toggler">
            <Card body>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt magni,
                voluptas debitis similique porro a molestias consequuntur earum odio
                officiis natus, amet hic, iste sed dignissimos esse fuga! Minus, alias.
            </Card>
        </UncontrolledCollapse>
    </div>
</Row>
