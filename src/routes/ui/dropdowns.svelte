<script>
    let title = "Ниспадающее контекстное меню | UI | Пользовательский Интерфейс";
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";

    import  Dropdown from "sveltestrap/src/Dropdown.svelte";
    import  DropdownItem from "sveltestrap/src/DropdownItem.svelte";
    import  DropdownMenu from "sveltestrap/src/DropdownMenu.svelte";
    import  DropdownToggle from "sveltestrap/src/DropdownToggle.svelte";

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
    let leftIsOpen = false;
    let rightIsOpen = false;

</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Ниспадающее контекстное меню</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Ниспадающее контекстное меню</BreadcrumbItem>
</Breadcrumb>
<!--<Row>-->
<!--    <div class="col-xl-6">-->
<!--        <h3 class="mt-4">Пример</h3>-->
<!--    </div>-->
<!--</Row>-->

<Row>
    <div class="col-xl-6">
          <h3 class="mt-4">Пример</h3>
        <p class="lead">
            Переключайте контекстные накладки для отображения списков ссылок
            и многое другое с помощью выпадающего плагина Sveltestrap.
        </p>
        <h4 class="mt-4">Обзор</h4>
        <p>Dropdowns - это переключаемые контекстные вкладки
            для отображения списков ссылок и многого другого.
            Они сделаны интерактивными с помощью входящего в комплект
            Sveltestrap выпадающего плагина JavaScript.
            Они переключаются щелчком мыши, а не навешиванием;
            это преднамеренное дизайнерское решение.</p>
    </div>
    <div class="col-xl-6">
        <Dropdown   {isOpen} toggle={() => (isOpen = !isOpen)}>
            <DropdownToggle caret>Dropdown</DropdownToggle>
            <DropdownMenu>
                <DropdownItem header>Хедер</DropdownItem>
                <DropdownItem>Какие-то действия</DropdownItem>
                <DropdownItem disabled>Действия (не активно)</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Foo Действия</DropdownItem>
                <DropdownItem>Bar Действия</DropdownItem>
                <DropdownItem>Baz Действия</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</Row>

<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Выравнивание</h2>
        <h3 class="mt-4">Пример</h3>
        <Dropdown isOpen={isOpen} toggle="{() => isOpen = !isOpen}">
            <DropdownToggle caret>
                Ниспадающее меню выравненное по правому краю
            </DropdownToggle>
            <DropdownMenu right>
                <DropdownItem header>Заголовок</DropdownItem>
                <DropdownItem disabled>Действие</DropdownItem>
                <DropdownItem>Другое действие</DropdownItem>
            </DropdownMenu>
        </Dropdown>

    </div>

</Row>

<Row>
    <div class="col-xl-12">
        <Dropdown
                direction="up"
                {isOpen}
                toggle={() => (isOpen = !isOpen)}
        >
            <DropdownToggle caret>Dropup</DropdownToggle>
            <DropdownMenu>
                <DropdownItem>Another Action</DropdownItem>
                <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
        </Dropdown>

        <Dropdown
                direction="left"
                isOpen={leftIsOpen}
                toggle={() => (leftIsOpen = !leftIsOpen)}
        >
            <DropdownToggle caret>Dropleft</DropdownToggle>
            <DropdownMenu>
                <DropdownItem>Another Action</DropdownItem>
                <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
        </Dropdown>

        <Dropdown
                direction="right"
                isOpen={rightIsOpen}
                toggle={() => (rightIsOpen = !rightIsOpen)}
        >
            <DropdownToggle caret>Dropright</DropdownToggle>
            <DropdownMenu>
                <DropdownItem>Another Action</DropdownItem>
                <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</Row>
