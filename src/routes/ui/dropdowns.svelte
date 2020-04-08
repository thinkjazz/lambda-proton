<script>
    let title = "Ниспадающее контекстное меню | UI | Пользовательский Интерфейс";
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";

    import  Dropdown from "sveltestrap/src/Dropdown.svelte";
    import  DropdownItem from "sveltestrap/src/DropdownItem.svelte";
    import  DropdownMenu from "sveltestrap/src/DropdownMenu.svelte";
    import  DropdownToggle from "sveltestrap/src/DropdownToggle.svelte";
    import  UncontrolledDropdown from "sveltestrap/src/UncontrolledDropdown.svelte";

    import  Nav from "sveltestrap/src/Nav.svelte";
    import  NavItem from "sveltestrap/src/NavItem.svelte";
    import  NavLink from "sveltestrap/src/NavLink.svelte";
    import  Navbar  from "sveltestrap/src/Navbar.svelte";

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

    let lgIsOpen = false;
    let smIsOpen = false;

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
<Row>
    <div class="col-xl-6">
          <h3 class="mt-4">Размер</h3>
          <h4 class="mt-4">Пример</h4>
          <div class="mb-3">
  <Dropdown
    group
    isOpen={lgIsOpen}
    size="lg"
    toggle={() => (lgIsOpen = !lgIsOpen)}
  >
    <DropdownToggle caret>Large Dropdown</DropdownToggle>
    <DropdownMenu>
      <DropdownItem>Shave the modern way</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</div>

<div class="mb-3">
  <Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>
    <DropdownToggle caret>Dropdown</DropdownToggle>
    <DropdownMenu>
      <DropdownItem>No Brush, No Lather</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</div>

<div class="mb-3">
  <Dropdown
    group
    isOpen={smIsOpen}
    size="sm"
    toggle={() => (smIsOpen = !smIsOpen)}
  >
    <DropdownToggle caret>Small Dropdown</DropdownToggle>
    <DropdownMenu>
      <DropdownItem>Burma-Shave</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</div>

    </div>
     <div class="col-xl-6">
          <h3 class="mt-4">Независимый</h3>
          <h4 class="mt-4">Пример</h4>
<UncontrolledDropdown>
  <DropdownToggle caret>Dropdown</DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Header</DropdownItem>
        <DropdownItem disabled>Action</DropdownItem>
        <DropdownItem>Another Action</DropdownItem>
        <DropdownItem divider />
        <DropdownItem>Another Action</DropdownItem>
      </DropdownMenu>
</UncontrolledDropdown>
    </div>
</Row>
<Row>
     <div class="col-xl-12">
          <h3 class="mt-4">SetActiveFromChild</h3>
          <h4 class="mt-4">Пример</h4>
<Navbar color="light" light expand="md">
  <Nav class="ml-auto" navbar>
    <NavItem>
      <NavLink href="/components/">Inactive Link</NavLink>
    </NavItem>
    <UncontrolledDropdown setActiveFromChild>
      <DropdownToggle nav class="nav-link" caret>Dropdown</DropdownToggle>
      <DropdownMenu>
        <DropdownItem tag="a" href="/blah" active>Link</DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  </Nav>
</Navbar>
    </div>
</Row>
<Row>
  <div class="col-xl-12"><br></div>
</Row>