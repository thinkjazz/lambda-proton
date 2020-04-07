<script>
    let title = "Коллапсер | UI | Пользовательский Интерфейс";
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";
    import  Button from "sveltestrap/src/Button.svelte";
    import  Collapse from "sveltestrap/src/Collapse.svelte";
    import  CardBody from "sveltestrap/src/CardBody.svelte"
    import  Card from "sveltestrap/src/Card.svelte"

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

    let status ="Закрыто";
    const onEntering = () => (status = "Открывается...");
    const onEntered = () => (status = "Открыто");
    const onExiting = () => (status = "Закрывается...");
    const onExited = () => (status = "Закрыто");


</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4"> Коллапсер</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Коллапсер</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Коллапсер</h2>
        <p class="lead">
    Переключайте видимость контента в вашем проекте
    с помощью нескольких классов и наших плагинов JavaScript.
        </p>
        <h3 class="mt-4"> Как это работает</h3>
        <p>
            Плагин JavaScript используется для отображения и скрытия
            содержимого.
            Кнопки или якоря используются в качестве триггеров,
            которые привязываются к определенным элементам,
            которые вы переключите. Свертывание элемента анимирует высоту от текущего значения до 0. Учитывая, как CSS обрабатывает анимацию, вы не можете использовать подкладку на .свертывающемся элементе. Вместо этого используйте класс в качестве независимого оберточного элемента.
            Эффект анимации этого элемента зависит от медиа-запроса
            "Предпочтение - уменьшение движения".</p>
    </div>
    <div class="col-xl-6">
        <h3 class="mt-4"><small>Пример</small></h3>
        <Button color="primary" on:click={() => (isOpen = !isOpen)} class="mb-3">
            Переключатель
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
        <h2 class="mt-4">События</h2>
        <p class="lead">
            Используйте props on:enter, onEntering, onExiting и onExited
            для обратных вызовов после того,
            как Collapse завершит открытие (entering) или закрытие (exiting).
        </p>
    </div>
    <div class="col-xl-6">
        <h3 class="mt-4"><small>Пример</small></h3>
        <Button color="primary" on:click={() => (isOpen = !isOpen)} class="mb-3">
            Переключатель
        </Button>
        <h5>Текущее состояние: {status}</h5>
        <Collapse {isOpen} {onEntering} {onEntered} {onExiting} {onExited}>
            <Card body>
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes
                anderson cred nesciunt sapiente ea proident.
            </Card>
        </Collapse>
    </div>
</Row>
