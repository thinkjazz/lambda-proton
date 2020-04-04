<script>
    let title = "Пагинация | UI | Пользовательский Интерфейс";
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
<h1 class="mt-4">Пагинация</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Пагинация</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-12">
        <h2 class="mt-4">Обзор</h2>
    <div>
        <p>
            Мы используем большой блок подключенных ссылок для нашей разбивки по страницам,
            что делает ссылки трудно пропустить и легко масштабируемые - все это в то же время обеспечивает большие хитовые области.
            Пагинация построена с элементами списка HTML, чтобы читатели экрана могли объявлять количество доступных ссылок. Используйте оберточный элемент, <code>nav </code>,
            чтобы идентифицировать его как раздел навигации для экранных читателей и других вспомогательных технологий. </p>
        <p>
            Кроме того, поскольку страницы, вероятно, имеют более одного такого раздела навигации,
            рекомендуется предоставить описательную арию-ярлык для, <code>nav</code> чтобы отразить его назначение.
            Например, если компонент пагинации используется для навигации между набором результатов поиска,
            соответствующей меткой может быть aria-label="страницы результатов поиска".
        </p>
        <h2 class="mt-4">Пример</h2>
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
        <h2 class="mt-4">Размеры элементов пагинации</h2>
        <div>
            <h4>Большой</h4>
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

            <h4>Маленький</h4>
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
