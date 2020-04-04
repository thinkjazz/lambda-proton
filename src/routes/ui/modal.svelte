<script>
    import  Breadcrumb  from "sveltestrap/src/Breadcrumb.svelte";
    import  BreadcrumbItem  from "sveltestrap/src/BreadcrumbItem.svelte";
    import  Row  from "sveltestrap/src/Row.svelte";
    import  Button from "sveltestrap/src/Button.svelte";
    import  ButtonGroup from "sveltestrap/src/ButtonGroup.svelte";
    import  Modal from "sveltestrap/src/Modal.svelte";
    import  ModalBody from "sveltestrap/src/ModalBody.svelte";
    import  ModalFooter from "sveltestrap/src/ModalFooter.svelte";
    import  ModalHeader from "sveltestrap/src/ModalHeader.svelte";
    let open = false;
    const toggle = () => (open = !open);

    let openSizeModal = false;
    let size;
    const toggleSt = () => {
        size = undefined;
        openSizeModal = !openSizeModal;
    };
    const toggleLg = () => {
        size = "lg";
        openSizeModal = !openSizeModal;
    };
    const toggleSm = () => {
        size = "sm";
        openSizeModal = !openSizeModal;
    };


    let title = "Модальные окна | UI | Пользовательский Интерфейс";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1 class="mt-4">Модальные окна</h1>
<Breadcrumb class="mb-4">
    <BreadcrumbItem active>Модальные окна</BreadcrumbItem>
</Breadcrumb>
<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Модальные окна</h2>
        <div>
            <p>
                Используйся плагин JavaScript \ Svelte для добавления диалогов для лайтбоксов,
                уведомлений пользователей или полностью пользовательского контента.
            </p>
            <Button color="danger" on:click={toggle}>
                Открыть модальное окно
            </Button>

            <Modal isOpen={open} {toggle}>
                <ModalHeader {toggle}>Заголовок</ModalHeader>
                <ModalBody>
                    Вуууу, ты читаешь этот текст модальным способом!
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

<Row>
    <div class="col-xl-6">
        <h2 class="mt-4">Модальные окна: Размеры</h2>
        <div>
            <ButtonGroup>
                <Button color="success" on:click={toggleSm}>
                   Маленькое окно
                </Button>
                <Button color="warning" on:click={toggleSt}>
                    Стандартное окно
                </Button>
                <Button color="danger" on:click={toggleLg}>
                    Большое окно
                </Button>
            </ButtonGroup>

            <Modal isOpen={openSizeModal} {toggleSt} {size}>
                <ModalHeader {toggleSt}>Заголовок</ModalHeader>
                <ModalBody>
                    Вуууу, ты читаешь этот текст модальным способом!
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" on:click={toggleSt}>
                        Ок
                    </Button>
                    <Button color="secondary" on:click={toggleSt}>
                        Отмена
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    </div>
</Row>
