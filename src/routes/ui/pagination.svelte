<script>
    let title = "Pagination | UI";
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";
    import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';
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
<h1 class="mt-4">Pagination</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Pagination</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-12">
        <h2 class="mt-4">Overview</h2>
    <div>
        <p>
            We use a large block of connected links to break down our pages,
            which makes links difficult to skip and easily scalable - all this at the same time provides large hit areas.
            Pagination is built with elements of the HTML list so that screen readers can declare the number of available links. Use a wrapper element, <code>nav</code>.
            to identify it as a navigation section for screen readers and other support technologies. </p>
        <p>
            In addition, since pages probably have more than one such navigation section,
            it is recommended to provide a descriptive aria-label for, <code>nav</code> to reflect its purpose.
            For example, if a pagination component is used to navigate between a set of search results,
            The corresponding label may be aria-label="search result pages".
        </p>
        <h2 class="mt-4">Example</h2>
        <Pagination ariaLabel="Page navigation example">
            <PaginationItem disabled>
                <PaginationLink first href="#" />
            </PaginationItem>
            <PaginationItem disabled>
                <PaginationLink previous href="#" />
            </PaginationItem>
            <PaginationItem active>
                <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink next href="#" />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink last href="#" />
            </PaginationItem>
        </Pagination>

    </div>
    </div>
</Row>
<Row>
    <div class="col-xl-12">
        <h2 class="mt-4">Sizes of pagination elements</h2>
        <div>
            <h4>Large</h4>
            <Pagination size="lg" ariaLabel="Page navigation example">
                <PaginationItem>
                    <PaginationLink first href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink previous href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink next href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink last href="#" />
                </PaginationItem>
            </Pagination>

            <h4>Small</h4>
            <Pagination size="sm" ariaLabel="Page navigation example">
                <PaginationItem>
                    <PaginationLink first href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink previous href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink next href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink last href="#" />
                </PaginationItem>
            </Pagination>

        </div>
    </div>
</Row>
