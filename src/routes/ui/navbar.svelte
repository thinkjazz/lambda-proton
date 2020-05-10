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
    import UncontrolledCollapse from "sveltestrap/src/UncontrolledCollapse.svelte";

    const colors = [
        "primary", "secondary", "success", "danger", "warning", "info", "light", "dark"
    ];


    let isOpen = false;

    function handleUpdate(event) {
        isOpen = event.detail.isOpen;
    }
    const toggler = () => (isOpen = !isOpen);
    let title = "Navigation menu | UI | User Interface";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Navigation menu </h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Navigation menu</BreadcrumbItem>
</Breadcrumb>

<Row>
    <div class="col-xl-12">
        <h3 class="mt-4">Example</h3>
        <Navbar color="dark">
            <NavbarBrand href="/" class="mr-auto">λproton </NavbarBrand>
            <NavbarToggler on:click={toggler} className="mr-2" />
            <Collapse {isOpen} navbar>
                <Nav navbar>
                    <NavItem>
                        <NavLink href="#components">Components</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="https://github.com/thinkjazz/lambda-proton">GitHub</NavLink>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    </div>
</Row>
<Row>
    <div class="col-xl-12">
        <h3 class="mt-4">Example</h3>
        <Navbar color="light" light expand="md">
            <NavbarBrand href="/">λproton navigation</NavbarBrand>
            <NavbarToggler on:click={() => (isOpen = !isOpen)} />
            <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
                <Nav class="ml-auto" navbar>
                    <NavItem>
                        <NavLink href="#components">Components</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="https://github.com/thinkjazz/lambda-proton">GitHub</NavLink>
                    </NavItem>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>Element</DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>Element 1</DropdownItem>
                            <DropdownItem>Element 2</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>Reset</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            </Collapse>
        </Navbar>
    </div>
</Row>
<Row>
    <div class="col-xl-12">
        <h2 class="mt-4">Color schemes of the navigation menu</h2>
        <p class="info">
            Change the background color of Navbar with the colored <code>color</code> of the props (property).
            Use <code>light</code> or <code>dark</code>props.
            to change the text color in the navigation bar for lighter or darker <code>color</code> values.
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


