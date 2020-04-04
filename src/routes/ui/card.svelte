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

    let title = "Карточки | UI | Пользовательский Интерфейс";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Карточки</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Карточки</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Карточки</h2>
        <Card>
            <CardBody>Привет, Мир!</CardBody>
        </Card>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Сокращенная запись</h2>
        <Card body>Goodbye Cruel World</Card>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Хедер и Футер</h2>
        <Card class="mb-3">
            <CardHeader>
                <CardTitle>Заголовок</CardTitle>
            </CardHeader>
            <CardBody>
                <CardSubtitle>Подзаголовок карточки</CardSubtitle>
                <CardText>
                    Быстрый пример текста для построения на заголовке карточки
                    и составляют большую часть содержимого карточки.
                </CardText>
                <Button>Кнопка</Button>
            </CardBody>
            <CardFooter>Футер</CardFooter>
        </Card>
    </div>
</Row>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Цвета в карточках</h2>
        <Card body color="primary" inverse class="mb-3">Основной</Card>
        <Card body color="secondary" class="mb-3 text-white">Вторичный</Card>
        <Card body color="success" class="mb-3">Успешный</Card>
        <Card body color="danger" class="mb-3 text-white">Опасность</Card>
        <Card body color="warning" class="mb-3">Предупреждение</Card>
        <Card body color="info" class="mb-3 text-white">Инфо</Card>
        <Card body color="dark" inverse class="mb-3">Тёмный</Card>
        <Card body color="light" class="mb-3">Светлый</Card>
    </div>
</Row>
