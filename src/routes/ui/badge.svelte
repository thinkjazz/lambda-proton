<script>
    import Breadcrumb from "sveltestrap/src/Breadcrumb.svelte";
    import BreadcrumbItem from "sveltestrap/src/BreadcrumbItem.svelte";
    import Row from "sveltestrap/src/Row.svelte";
    import Badge from "sveltestrap/src/Badge.svelte";
    import Button from "sveltestrap/src/Button.svelte";

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
    let title = "Badges | UI";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Badges</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Badges</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Example</h2>
        <h1>Heading  <Badge color="success">New</Badge></h1>
        <h2>Heading <Badge color="warning" >New</Badge></h2>
        <h3>Heading <Badge color="danger" >New</Badge></h3>
        <h4>Heading <Badge>New</Badge></h4>
        <h5>Heading <Badge>New</Badge></h5>
        <h6>Heading <Badge>New</Badge></h6>
    </div>
    <div class="col-xl-6">
            <h2 class="mt-4">Notification</h2>
        <h4 class="mt-4">Example</h4>
        <Button color="primary" outline>
            Notification <Badge color="secondary">4</Badge>
        </Button>
    </div>
    <div class="col-xl-6">

        <h2 class="mt-4">Color</h2>
        <h4 class="mt-4">Example</h4>
        {#each colors as color}
            <div>
                <Badge {color}>
                    {color}
                </Badge>
            </div>
        {/each}
    </div>
    <div class="col-xl-6">
        <h2 class="mt-4">Round badges</h2>
        <h4 class="mt-4">Example</h4>
        {#each colors as color}
            <div>
                <Badge pill {color}>
                    {color}
                </Badge>
            </div>
        {/each}
    </div>
</Row>
  <Row>
      <div class="col-xl-12">
          <h2 class="mt-4">Color badges</h2>
          <h4 class="mt-4">Example</h4>
          <Badge href="#" color="primary">Primary</Badge>
          <Badge href="#" color="secondary">Secondary</Badge>
          <Badge href="#" color="success">Success</Badge>
          <Badge href="#" color="danger">Danger</Badge>
          <Badge href="#" color="warning">Warning</Badge>
          <Badge href="#" color="info">Info</Badge>
          <Badge href="#" color="light">Light</Badge>
          <Badge href="#" color="dark">Dark</Badge>
      </div>
  </Row>


<Row>
    <div class="col-xl-12">
        <br>
    </div>
</Row>
