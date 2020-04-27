<script>
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row from "sveltestrap/src/Row.svelte";
    import  Col from "sveltestrap/src/Col.svelte";
    import  Container from "sveltestrap/src/Container.svelte";




    let title = "Grid | UI";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Grid</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Grid</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Grid</h2>
        <Container>
            <Row>
                <Col><code>.col</code></Col>
            </Row>
            <Row>
                <Col><code>.col</code></Col>
                <Col><code>.col</code></Col>
                <Col><code>.col</code></Col>
                <Col><code>.col</code></Col>
            </Row>
            <Row>
                <Col xs="3"><code>.col-3</code></Col>
                <Col xs="auto">
                    <code>.col-auto - variable width content</code>
                </Col>
                <Col xs="3"><code>.col-3</code></Col>
            </Row>
            <Row>
                <Col xs="6"><code>.col-6</code></Col>
                <Col xs="6"><code>.col-6</code></Col>
            </Row>
            <Row>
                <Col xs="6" sm="4"><code>.col-6 .col-sm-4</code></Col>
                <Col xs="6" sm="4"><code>.col-6 .col-sm-4</code></Col>
                <Col sm="4"><code>.col-sm-4</code></Col>
            </Row>
            <Row>
                <Col sm={{ size: 6, order: 2, offset: 1 }}>
                    <code>.col-sm-6 .order-sm-2 .offset-sm-1</code>
                </Col>
            </Row>
            <Row>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <code>.col-sm-12 .col-md-6 .offset-md-3</code>
                </Col>
            </Row>
            <Row>
                <Col sm={{ size: 'auto', offset: 1 }}>
                    <code>.col-sm-auto .offset-sm-1</code>
                </Col>
                <Col sm={{ size: 'auto', offset: 1 }}>
                    <code>.col-sm-auto .offset-sm-1</code>
                </Col>
            </Row>
        </Container>

    </div>
</Row>
