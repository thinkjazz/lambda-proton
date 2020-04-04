<script>
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";
    import  Button from "sveltestrap/src/Button.svelte";
    import  Modal from "sveltestrap/src/Modal.svelte";
    import  ModalBody from "sveltestrap/src/ModalBody.svelte";
    import  ModalFooter from "sveltestrap/src/ModalFooter.svelte";
    import  ModalHeader from "sveltestrap/src/ModalHeader.svelte";
    let open = false;
    const toggle = () => (open = !open);

    let title = "Модальные окна | UI | Пользовательский Интерфейс";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Модальные окна</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Группы кнопок</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Модальное окно</h2>
        <div>
            <Button color="danger" on:click={toggle}>
                Открыть модальное окно
            </Button>
            <Modal isOpen={open} {toggle}>
                <ModalHeader {toggle}>Заголовок</ModalHeader>
                <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" on:click={toggle}>
                        Ок
                    </Button>
                    <Button color="secondary" on:click={toggle}>
                        Отмена
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    </div>
</Row>
