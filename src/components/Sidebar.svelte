<script>
  //Импортируем компоненты из bootstrap sveltestrap
  import Collapse from "sveltestrap/src/Collapse.svelte";
  import Nav from "sveltestrap/src/Nav.svelte";
  //Импортируем SidebarItem
  import SidebarItem from "./SidebarItem.svelte";
  //segment есть переменная для хранения состояния элемента меню и проверка для подрузки в сайдбар
  export let segment;
  //theme переменная для хранения состояния темы
  export let theme;

  $: sidenav_theme = `l-proton-sidenav-${theme}`;

  let isLayoutOpen = false;
  let isPageOpen = false;
  let isAuthenticationOpen = false;
  let isErrorOpen = false;
  let isUiOpen = false;
  let activeLink = "λboard";
  let footerName = "λproton boy";
  let footerText = "You entred:";
  let uiLabels = [
    { id: 1, label: "Alerts", name: "alerts", icon: "fas fa-exclamation-triangle"},
    { id: 2, label: "Badge", name:"badge", icon: "fas fa-certificate"},
    { id: 3, label: "Breadcrumb", name:"breadcrumb", icon:"fas fa-ellipsis-h"},
    { id: 4, label: "Buttons", name:"buttons", icon:"fas fa-angle-double-right"},
    { id: 5, label: "Button group", name:"buttonGroup", icon:""},
    { id: 6, label: "Card", name:"card", icon:""},
    { id: 7, label: "Carousel", name:"carousel", icon:""},
    { id: 8, label: "Collapse", name:"collapse", icon:""},
    { id: 9, label: "Custom Inputs", name:"customInputs", icon:""},
    { id: 10, label: "Dropdowns", name:"dropdowns", icon:""},
    { id: 11, label: "Forms", name:"forms", icon:""},
    { id: 12, label: "Grid", name: "grid", icon: "fas fa-exclamation-triangle"},
    { id: 13, label: "Input", name: "input", icon: "fas fa-exclamation-triangle"},
    { id: 14, label: "Input group", name:"inputGroup", icon:""},
    { id: 15, label: "Jumbotron", name:"jumbotron", icon:""},
    { id: 16, label: "List group", name:"listGroup", icon:""},
    { id: 17, label: "Media object", name:"mediaObject", icon:""},
    { id: 18, label: "Modal", name:"modal", icon:""},
    { id: 19, label: "Navs", name:"navs", icon:""},
    { id: 20, label: "Navbar", name:"navbar", icon:""},
    { id: 21, label: "Pagination", name:"pagination", icon:""},
    { id: 22, label: "Popovers", name:"popovers", icon:""},
    { id: 23, label: "Progress", name:"progress", icon:""},
    { id: 24, label: "Scrollspy", name:"scrollspy", icon:""},
    { id: 25, label: "Spinners", name:"spinners", icon:""},
    { id: 26, label: "Toasts", name:"toasts", icon:""},
    { id: 27, label: "Tooltips", name:"tooltips", icon:""}
  ];

  const updateActiveLink = (linkName) => (activeLink = linkName);


  const toggleUi = () => {
    isUiOpen = !isUiOpen;
    if (isLayoutOpen === true) isLayoutOpen = false;
  };

  const toggleLayout = () => {
    isLayoutOpen = !isLayoutOpen;
    if (isPageOpen === true) isPageOpen = false;
  };

  const togglePages = () => {
    isPageOpen = !isPageOpen;
    if (isLayoutOpen === true) isLayoutOpen = false;
    if (isPageOpen === false) {
      isAuthenticationOpen = false;
      isErrorOpen = false;
    }
  };

  const toggleAuthentication = () => {
    isAuthenticationOpen = !isAuthenticationOpen;
    if (isErrorOpen === true) isErrorOpen = false;
  };

  const toggleError = () => {
    isErrorOpen = !isErrorOpen;
    if (isAuthenticationOpen === true) isAuthenticationOpen = false;
  };

</script>

<div id="layoutSidenav_nav" class="l-proton-nav-fixed">
  <Nav
    class="l-proton-sidenav {sidenav_theme} accordion l-proton-nav-fixed"
    id="sidenavAccordion">
    <div class="l-proton-sidenav-menu">
      <Nav>
        <div class="l-proton-sidenav-menu-heading">Core</div>
        <SidebarItem
          on:press={() => {
            theme = 'dark';
          }}
          text="Panel"
          class={segment === '.' || segment === undefined ? 'active' : ''}
          leftIcon
          href=".">
          <i class="fas fa-atom" slot="leftIcon" />
        </SidebarItem>

        <div class="l-proton-sidenav-menu-heading">User Elements</div>

        
        <SidebarItem
          on:press={toggleUi}
          class={!isUiOpen ? 'collapsed' : ''}
          text="UI Kit"
          leftIcon
          rightIcon>

          <i class="fas fa-grip-horizontal" slot="leftIcon" />
          <i class="fas fa-angle-down" slot="rightIcon" />
        </SidebarItem>
        <Collapse isOpen={isUiOpen}>
          <Nav class="l-proton-sidenav-menu-nested">
          {#each uiLabels as {id, label, name, icon}}
          <SidebarItem
              on:press={()=>{
                updateActiveLink(name)
              }}
              class={segment === 'ui' && activeLink === name ? 'active' : ''}
              href="ui/{name}"
              text={label}>
          </SidebarItem>   
            {/each}
          </Nav>
        </Collapse>


        <SidebarItem
          on:press={toggleLayout}
          class={!isLayoutOpen ? 'collapsed' : ''}
          text="Layouts"
          leftIcon
          rightIcon>
          <i class="fas fa-columns" slot="leftIcon" />
          <i class="fas fa-angle-down" slot="rightIcon" />
        </SidebarItem>

        <Collapse isOpen={isLayoutOpen}>
          <Nav class="l-proton-sidenav-menu-nested">

            <SidebarItem
              on:press={() => {
                theme = 'dark';
                updateActiveLink('Static Navigation');
              }}
              class={segment === 'layouts' && activeLink === 'Static Navigation' ? 'active' : ''}
              href="layouts/static_navigation"
              text="Static Navigation" />
            <SidebarItem
              on:press={() => {
                theme = 'light';
                updateActiveLink('Light Sidenav');
              }}
              class={segment === 'layouts' && activeLink === 'Light Sidenav' ? 'active' : ''}
              href="layouts/light_sidenav"
              text="Light Sidenav" />
          </Nav>
        </Collapse>
        <SidebarItem
          on:press={togglePages}
          class={!isPageOpen ? 'collapsed' : ''}
          text="Pages"
          leftIcon
          rightIcon>
          <svg
            slot="leftIcon"
            class="svg-inline--fa fa-book-open fa-w-18"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="book-open"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            data-fa-i2svg="">
            <path
              fill="currentColor"
              d="M542.22 32.05c-54.8 3.11-163.72 14.43-230.96 55.59-4.64
              2.84-7.27 7.89-7.27 13.17v363.87c0 11.55 12.63 18.85 23.28 13.49
              69.18-34.82 169.23-44.32 218.7-46.92 16.89-.89 30.02-14.43
              30.02-30.66V62.75c.01-17.71-15.35-31.74-33.77-30.7zM264.73
              87.64C197.5 46.48 88.58 35.17 33.78 32.05 15.36 31.01 0 45.04 0
              62.75V400.6c0 16.24 13.13 29.78 30.02 30.66 49.49 2.6 149.59 12.11
              218.77 46.95 10.62 5.35 23.21-1.94
              23.21-13.46V100.63c0-5.29-2.62-10.14-7.27-12.99z" />
          </svg>
          <i class="fas fa-angle-down" slot="rightIcon" />
        </SidebarItem>
        <Collapse isOpen={isPageOpen}>
          <Nav
            class="l-proton-sidenav-menu-nested accordion"
            id="sidenavAccordionPages">
            <SidebarItem
              on:press={toggleAuthentication}
              class={!isAuthenticationOpen ? 'collapsed' : ''}
              text="Authentication"
              rightIcon>
              <i class="fas fa-angle-down" slot="rightIcon" />
            </SidebarItem>
            <Collapse isOpen={isAuthenticationOpen}>
              <Nav class="l-proton-sidenav-menu-nested">
                <SidebarItem href="pages/authentication/login" text="Login" />
                <SidebarItem
                  href="pages/authentication/register"
                  text="Register" />
                <SidebarItem
                  href="pages/authentication/forget_password"
                  text="Forget_password" />
              </Nav>
            </Collapse>
            <SidebarItem
              on:press={toggleError}
              class={!isErrorOpen ? 'collapsed' : ''}
              text="Error"
              rightIcon>
              <i class="fas fa-angle-down" slot="rightIcon" />
            </SidebarItem>
            <Collapse isOpen={isErrorOpen}>
              <Nav class="l-proton-sidenav-menu-nested">
                <SidebarItem href="pages/error/error_401" text="401 Page" />
                <SidebarItem href="pages/error/error_404" text="404 Page" />
                <SidebarItem href="pages/error/error_500" text="500 Page" />
              </Nav>
            </Collapse>
          </Nav>
        </Collapse>
        <div class="l-proton-sidenav-menu-heading">Mixins & Data</div>
        <SidebarItem
          class={segment === 'charts' ? 'active' : ''}
          on:press={() => {
            theme = 'dark';
          }}
          href="charts"
          text="Charts"
          leftIcon>
          <i class="fas fa-chart-area" slot="leftIcon" />
        </SidebarItem>
        <SidebarItem
          class={segment === 'tables' ? 'active' : ''}
          on:press={() => {
            theme = 'dark';
          }}
          href="tables"
          text="Tables"
          leftIcon>
          <i class="fas fa-table" slot="leftIcon" />
        </SidebarItem>

      </Nav>
    </div>
    <div class="l-proton-sidenav-footer">
      <div class="small">{footerText}</div>
      <span class="badge badge-danger">{footerName}</span>
    </div>
  </Nav>
</div>
