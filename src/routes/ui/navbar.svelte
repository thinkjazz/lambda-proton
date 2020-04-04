<script>
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";
    import  Button from "sveltestrap/src/Button.svelte";
    import  Collapse from "sveltestrap/src/Collapse.svelte";
    import  Navbar  from "sveltestrap/src/Navbar.svelte";
    import  NavbarToggler from "sveltestrap/src/NavbarToggler.svelte";
    import  NavbarBrand from "sveltestrap/src/NavbarBrand.svelte";
    import  Nav from  "sveltestrap/src/Nav.svelte";
    import  NavItem from  "sveltestrap/src/NavItem.svelte";
    import  NavLink from  "sveltestrap/src/NavLink.svelte";
    import  UncontrolledDropdown from "sveltestrap/src/UncontrolledDropdown.svelte";
    import  DropdownToggle from "sveltestrap/src/DropdownToggle.svelte";
    import  DropdownMenu from "sveltestrap/src/DropdownMenu.svelte";
    import  DropdownItem from "sveltestrap/src/DropdownItem.svelte";

    const colors = [
        "primary", "secondary", "success", "danger", "warning", "info", "light", "dark"
    ];


    let isOpen = false;

    function handleUpdate(event) {
        isOpen = event.detail.isOpen;
    }
    // let open = false;
    // const toggle = () => (open = !open);

    let title = "Навигационное меню | UI | Пользовательский Интерфейс";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Навигационное меню</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Навигационное меню</BreadcrumbItem>
</Breadcrumb>

<!--<Row>-->
<!--    <div class="col-xl-12">-->
<!--        <h2 class="mt-4">Навигационный тогглер Toggler</h2>-->
<!--        <Navbar color="light" light>-->
<!--            <NavbarBrand href="/" class="mr-auto">sveltestrap</NavbarBrand>-->
<!--            <NavbarToggler on:click={toggle} className="mr-2" />-->
<!--            <Collapse {open} navbar>-->
<!--                <Nav navbar>-->
<!--                    <NavItem>-->
<!--                        <NavLink href="#components/">Components</NavLink>-->
<!--                    </NavItem>-->
<!--                    <NavItem>-->
<!--                        <NavLink href="https://github.com/bestguy/sveltestrap">GitHub</NavLink>-->
<!--                    </NavItem>-->
<!--                </Nav>-->
<!--            </Collapse>-->
<!--        </Navbar>-->
<!--    </div>-->
<!--</Row>-->
<Row>
    <div class="col-xl-12">
        <h2 class="mt-4">Навигационное меню</h2>

        <Navbar color="light" light expand="md">
            <NavbarBrand href="/">λproton navigation</NavbarBrand>
            <NavbarToggler on:click={() => (isOpen = !isOpen)} />
            <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
                <Nav class="ml-auto" navbar>
                    <NavItem>
                        <NavLink href="#components/">Компоненты</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="https://github.com/thinkjazz/lambda-proton">GitHub</NavLink>
                    </NavItem>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>Элемент</DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>Элемент 1</DropdownItem>
                            <DropdownItem>Элемент 2</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>Сброс</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            </Collapse>
        </Navbar>
    </div>
</Row>
<Row>
    <div class="col-xl-12">
        <h2 class="mt-4">Цветные схемы навигационного меню</h2>
        <p class="info">
            Измените цвет фона Навбара с помощью цветной  <code>color</code> пропсы (свойство).
            Используйте <code>light</code> or <code>dark</code> пропсы
            чтобы изменить цвет текста на панели навигации для более светлых или темных <code>color</code> значений.
            </p>
        {#each colors as color}
            <Navbar
                    color={color}
                    dark={color === 'dark' || color === 'primary'}
                    light={color !== 'light' && color !== 'primary'}
                    class="mb-2"
            >
                <NavbarBrand href="/">{color} Navbar</NavbarBrand>
            </Navbar>
        {/each}
    </div>
</Row>


