<script>
    let title = "ШАБЛОН | UI | Пользовательский Интерфейс";
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



</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">ШАБЛОН</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>ШАБЛОН</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">ШАБЛОН</h2>
        <h3 class="mt-4">Пример</h3>
    </div>
</Row>

<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">ШАБЛОН</h2>
        <h3 class="mt-4">Пример</h3>
<p class="lead">
    Переключайте видимость контента в вашем проекте
    с помощью нескольких классов и наших плагинов JavaScript.
</p>
<p><small>Как это работает
    Плагин JavaScript используется для отображения и скрытия
    содержимого.
    Кнопки или якоря используются в качестве триггеров,
    которые привязываются к определенным элементам, которые
    вы переключите.
    Свертывание элемента анимирует высоту от текущего значения до 0.
    Учитывая, как CSS обрабатывает анимацию, вы не можете использовать подкладку на .свертывающемся элементе. Вместо этого используйте класс в качестве независимого оберточного элемента.
    Эффект анимации этого элемента зависит от медиа-запроса
    "Предпочтение - уменьшение движения".</small></p>
</div>

</Row>
