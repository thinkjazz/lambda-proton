<script>
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row from "sveltestrap/src/Row.svelte";
    import  Col from "sveltestrap/src/Col.svelte";
    import  Container from "sveltestrap/src/Container.svelte";




    let title = "Макеты и сетки | UI | Пользовательский Интерфейс";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Макеты и сетки</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Макеты и сетки</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Макеты и сетки</h2>
        <Container>
            <Row>
                <Col>.col</Col>
            </Row>
            <Row>
                <Col>.col</Col>
                <Col>.col</Col>
                <Col>.col</Col>
                <Col>.col</Col>
            </Row>
            <Row>
                <Col xs="3">.col-3</Col>
                <Col xs="auto">
                    .col-auto - variable width content
                </Col>
                <Col xs="3">.col-3</Col>
            </Row>
            <Row>
                <Col xs="6">.col-6</Col>
                <Col xs="6">.col-6</Col>
            </Row>
            <Row>
                <Col xs="6" sm="4">.col-6 .col-sm-4</Col>
                <Col xs="6" sm="4">.col-6 .col-sm-4</Col>
                <Col sm="4">.col-sm-4</Col>
            </Row>
            <Row>
                <Col sm={{ size: 6, order: 2, offset: 1 }}>
                    .col-sm-6 .order-sm-2 .offset-sm-1
                </Col>
            </Row>
            <Row>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                    .col-sm-12 .col-md-6 .offset-md-3
                </Col>
            </Row>
            <Row>
                <Col sm={{ size: 'auto', offset: 1 }}>
                    .col-sm-auto .offset-sm-1
                </Col>
                <Col sm={{ size: 'auto', offset: 1 }}>
                    .col-sm-auto .offset-sm-1
                </Col>
            </Row>
        </Container>

    </div>
</Row>
