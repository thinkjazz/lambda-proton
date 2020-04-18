<script>
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";
    import  Card from "sveltestrap/src/Card.svelte";
    import  CardBody from "sveltestrap/src/CardBody.svelte";
    import  Button from "sveltestrap/src/Button.svelte";
    import  CardFooter from "sveltestrap/src/CardFooter.svelte";
    import  CardHeader from "sveltestrap/src/CardFooter.svelte";
    import  CardImg from "sveltestrap/src/CardImg.svelte";
    import  CardTitle from "sveltestrap/src/CardTitle.svelte";
    import  CardText from "sveltestrap/src/CardText.svelte"
    import  CardSubtitle from "sveltestrap/src/CardSubtitle.svelte";

    let title = "Cards | UI ";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Cards</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Cards</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Cards</h2>
        <h4 class="mt-4">Example</h4>
        <Card>
            <CardBody>Hello, World!</CardBody>
        </Card>
    </div>
    <div class="col-xl-6">
        <h2 class="mt-4">Short record</h2>
        <h4 class="mt-4">Example</h4>
        <Card body>Goodbye brutal World</Card>
    </div>
 </Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Header and Footer</h2>
        <h4 class="mt-4">Example</h4>
        <Card class="mb-3">
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
            </CardHeader>
            <CardBody>
                <CardSubtitle>Card Subtitle</CardSubtitle>
                <CardText>
                    Quick example text to build on the header of the card
                    and make up most of the contents of the card.
                </CardText>
                <Button>Button</Button>
            </CardBody>
            <CardFooter>Footer</CardFooter>
        </Card>
    </div>
    <div class="col-xl-6">
        <h2 class="mt-4">Colors in cards</h2>
        <h4 class="mt-4">Example</h4>
        <Card body color="primary" inverse class="mb-3">Primary</Card>
        <Card body color="secondary" class="mb-3 text-white">Secondary</Card>
        <Card body color="success" class="mb-3">Success</Card>
        <Card body color="danger" class="mb-3 text-white">Danger</Card>
        <Card body color="warning" class="mb-3">Warning</Card>
        <Card body color="info" class="mb-3 text-white">Info</Card>
        <Card body color="dark" inverse class="mb-3">Dark</Card>
        <Card body color="light" class="mb-3">Light</Card>
    </div>
</Row>
